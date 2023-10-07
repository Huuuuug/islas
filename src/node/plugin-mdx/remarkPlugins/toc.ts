import { visit } from 'unist-util-visit';
import Slugger from 'github-slugger';
import { parse } from 'acorn';

import type { Program } from 'mdast-util-mdxjs-esm';
import type { Root } from 'hast';
import type { Plugin } from 'unified';

const slugger = new Slugger();

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface ChildNode {
  type: 'link' | 'text' | 'inlineCode' | 'emphasis' | 'strong';
  value: string;
  children?: ChildNode[];
}

// interface Heading {
//   type: string;
//   depth?: number;
//   children?: ChildNode[];
// }

export const remarkPluginToc: Plugin<[], Root> = () => {
  return (tree) => {
    const toc: TocItem[] = [];
    visit(
      tree,
      'heading',
      (node: { depth?: number; type: string; children? }) => {
        if (!node.depth || !node.children?.length) return;
        // h2 - h4
        if (node.depth > 1 && node.depth < 5) {
          const originalText = (node.children as ChildNode[])
            .map((child) => {
              switch (child.type) {
                // child with value
                case 'text':
                case 'inlineCode':
                  return child.value;

                // child without value, but can get value from children property
                case 'emphasis':
                case 'strong':
                case 'link':
                  return child.children?.map((c) => c.value).join('') || '';

                // child without value and can not get value from children property
                default:
                  return '';
              }
            })
            .join('');
          const id = slugger.slug(originalText);
          toc.push({
            id,
            text: originalText,
            depth: node.depth
          });
        }
      }
    );

    // export const toc = []
    const insertedToCode = `export const toc =${JSON.stringify(toc, null, 2)}`;
    tree.children.push({
      type: 'mdxjsEsm',
      value: insertedToCode,
      data: {
        estree: parse(insertedToCode, {
          ecmaVersion: 2020,
          sourceType: 'module'
        }) as unknown as Program
      }
    });
  };
};
