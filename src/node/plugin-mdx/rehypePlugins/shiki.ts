import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';
import shiki from 'shiki';
import type { Text, Root } from 'hast';
import type { Plugin } from 'unified';

interface Options {
  highlighter: shiki.Highlighter;
}

export const rehypePluginShiki: Plugin<[Options], import('hast').Root> = ({
  highlighter
}) => {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      // <pre><code>...</code></pre>
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        const codeNode = node.children[0];
        const codeContent = (codeNode.children[0] as Text).value;
        const codeClassName = codeNode.properties?.className?.toString() || '';

        const lang = codeClassName.split('-')[1];
        if (!lang) {
          return;
        }
        // 高亮结果
        const highlightedCode = highlighter.codeToHtml(codeContent, { lang });
        // 将其转换为 AST 然后进行插入
        const fragmentAst = fromHtml(highlightedCode, { fragment: true });
        parent.children.splice(index, 1, ...fragmentAst.children);
      }
    });
  };
};
