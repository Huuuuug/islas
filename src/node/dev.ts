import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-islas/indexHtml';
// 局部热更新插件
import pluginReact from '@vitejs/plugin-react';

export function createDevServer(root: string) {
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  });
}
