import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Element, Root } from 'hast';

export const rehypePluginPreWrapper: Plugin<[], import('hast').Root> = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      // <pre><code>...</code></pre>
      // 1. 找到 pre 元素
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0]?.tagName === 'code' &&
        !node.data?.isVisited
      ) {
        const codeNode = node.children[0];
        const codeClassName = codeNode.properties?.className?.toString() || '';
        // language-js
        const lang = codeClassName.split('-')[1];

        // codeNode.properties.className = '';

        const cloneNode: Element = {
          type: 'element',
          tagName: 'pre',
          properties: {},
          // Attach a flag to prevent infinite recursion
          data: {
            isVisited: true
          },
          children: node.children
        };

        node.tagName = 'div';
        node.properties = node.properties || {};
        node.properties.className = codeClassName;

        node.children = [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'lang'
            },
            children: [{ type: 'text', value: lang }]
          },
          cloneNode
        ];
      }
    });
  };
};
