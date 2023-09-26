// vite插件 识别HTML模板
import { Plugin } from 'vite';
import { readFile } from 'fs/promises';
import { CLIENT_ENTRY_PATH, DEFAULT_TEMPLATE_PATH } from '../constants';

export function pluginIndexHtml(): Plugin {
  return {
    name: 'islas:index-html',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: 'body'
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res) => {
          // 1. 读取template.html 的内容
          let html = await readFile(DEFAULT_TEMPLATE_PATH, 'utf8');
          // vite 实现页面热更新
          html = await server.transformIndexHtml(
            req.url,
            html,
            req.originalUrl
          );
          // 2. 响应HTML内容 浏览器
          res.setHeader('Content-Type', 'text/html');
          res.end(html);
        });
      };
    }
  };
}
