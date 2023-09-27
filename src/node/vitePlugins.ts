import { pluginIndexHtml } from './plugin-islas/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { pluginConfig } from './plugin-islas/config';
import { pluginRoutes } from './plugin-routes';
import { SiteConfig } from 'shared/types';
import { createPluginMdx } from './plugin-mdx';
import type { Plugin } from 'vite';

export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>
) {
  return [
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic'
    }),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root
    }),
    await createPluginMdx()
  ] as Plugin[];
}
