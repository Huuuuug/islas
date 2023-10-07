import { Plugin } from 'vite';
import assert from 'assert';

export function pluginMdxHMR(): Plugin {
  let viteRecatPlugin: Plugin;
  return {
    name: 'vite-plugin-mdx-hmr',
    apply: 'serve',
    configResolved(config) {
      viteRecatPlugin = config.plugins.find(
        (plugin) => plugin.name === 'vite:react-babel'
      ) as Plugin;
    },
    async transform(code, id, opts) {
      if (/.mdx?$/.test(id)) {
        assert(typeof viteRecatPlugin.transform === 'function');
        const result = await viteRecatPlugin.transform.call(
          this,
          code,
          id + '?.jsx',
          opts
        );
        if (
          result &&
          typeof result === 'object' &&
          !result.code?.includes('import.meta.hot.accept()')
        ) {
          result.code += 'import.meta.hot.accept()';
        }
        return result;
      }
    }
  };
}
