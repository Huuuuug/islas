import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
// import ora from 'ora';
import * as path from 'path';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';
import { SiteConfig } from 'shared/types';
import { createVitePlugins } from './vitePlugins';

import type { RollupOutput } from 'rollup';
import type { Route } from './plugin-routes';
// const dynamicImport = new Function('m', 'return import(m)')

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (
    isServer: boolean
  ): Promise<InlineConfig> => {
    return {
      mode: 'production',
      root,
      plugins: await createVitePlugins(config, undefined, isServer),
      ssr: {
        noExternal: ['react-router-dom', 'lodash-es']
      },
      build: {
        ssr: isServer,
        outDir: isServer ? path.join(root, '.temp') : path.join(root, 'build'),
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
      return viteBuild(await resolveViteConfig(false));
    };
    // 服务端打包
    const serverBuild = async () => {
      return viteBuild(await resolveViteConfig(true));
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
  render: (pagePath: string) => Promise<string>,
  root: string,
  clientBundle: RollupOutput,
  routes: Route[]
) {
  // const appHTML = render();

  // 获取脚本文件
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  console.log('Rendering page in server side...');
  await Promise.all(
    routes.map(async (route) => {
      const routePath = route.path;
      const appHTML = await render(routePath);
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
      const fileName = routePath.endsWith('/')
        ? `${routePath}index.html`
        : `${routePath}.html`;
      await fs.ensureDir(path.join(root, 'build', path.dirname(fileName)));
      // 将html字符串写入磁盘 并删除服务端打包产物
      await fs.writeFile(path.join(root, 'build', fileName), html);
    })
  );
  await fs.remove(path.join(root, '.temp'));
}

export async function build(root: string = process.cwd(), config: SiteConfig) {
  // const spinner = ora();
  // spinner.start('building client + server bundles...');

  // 1. bundle -client 端 + server 端
  const [clientBundle] = await bundle(root, config);
  // 2. 引入 server-entry 模块
  const serverEntryPath = path.join(root, '.temp', 'ssr-entry.js');
  // 3. 服务端渲染,产出 HTML
  const { render, routes } = await import(
    pathToFileURL(serverEntryPath).toString()
  );
  try {
    await renerPage(render, root, clientBundle as RollupOutput, routes);
  } catch (e) {
    console.log('Render page errot.\n', e);
  }
}
