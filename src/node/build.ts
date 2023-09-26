import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import ora from 'ora';
import * as path from 'path';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';
import pluginReact from '@vitejs/plugin-react';

import type { RollupOutput } from 'rollup';
import { SiteConifg } from 'shared/types';
import { pluginConfig } from './plugin-islas/config';

// const dynamicImport = new Function('m', 'return import(m)')

export const okMark = '\x1b[32m✓\x1b[0m';

export async function bundle(root: string, config: SiteConifg) {
  const resolveViteConfig = (isServer: boolean): InlineConfig => {
    return {
      mode: 'production',
      root,
      plugins: [pluginReact(), pluginConfig(config)],
      ssr: {
        noExternal: ['react-router-dom']
      },
      build: {
        ssr: isServer,
        outDir: isServer ? '.temp' : 'build',
        rollupOptions: {
          input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: isServer ? 'cjs' : 'esm'
          }
        }
      }
    };
  };
  try {
    // 客户端打包
    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false));
    };
    // 服务端打包
    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    };
    // 防止阻塞
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    return [clientBundle, serverBundle];
  } catch (error) {
    console.log(error);
  }
}
export async function renerPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHTML = render();

  // 获取脚本文件
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  const html = `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>title</title>
        <meta name="description content="xxx">
      </head>
      <body>
        <div id="root">${appHTML}</div>
        <script src="/${clientChunk.fileName}" type="module"></script>
      </body>
    </html>
  `.trim();
  // 将html字符串写入磁盘 并删除服务端打包产物
  await fs.writeFile(path.join(root, 'build', 'index.html'), html);
  await fs.remove(path.join(root, '.temp'));
}

export async function build(root: string = process.cwd(), config: SiteConifg) {
  const spinner = ora();
  spinner.start('building client + server bundles...');

  // 1. bundle -client 端 + server 端
  const [clientBundle] = await bundle(root, config);
  // 2. 引入 server-entry 模块
  const serverEntryPath = path.join(root, '.temp', 'ssr-entry.js');
  // 3. 服务端渲染,产出 HTML
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  await renerPage(render, root, clientBundle as RollupOutput);

  spinner.stopAndPersist({
    symbol: okMark
  });
}
