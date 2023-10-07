import { PACKAGE_ROOT } from 'node/constants';
import { join, relative } from 'path';
import type { SiteConfig } from 'shared/types';
import type { Plugin } from 'vite';

const SITE_DATA_ID = 'islas:site-data';

export function pluginConfig(
  config: SiteConfig,
  restartServer?: () => Promise<void>
): Plugin {
  return {
    name: 'islas:site-data',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    config() {
      return {
        resolve: {
          alias: {
            '@runtime': join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts')
          }
        },
        css: {
          modules: {
            localsConvention: 'camelCaseOnly'
          }
        }
      };
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config.configPath.replaceAll('\\', '/')];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed,restarting server...`
        );
        // 重启 Dev Server
        // 1. 插件内重启Vite 的dev server
        // await server.restart()
        // × 无效 因为没有进行Islas框架的配置重新读取
        // 2. 手动调用dev.ts 中的 createServer
        await restartServer();
      }
    }
  };
}
