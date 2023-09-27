import fs from 'fs-extra';
import { resolve } from 'path';
import { loadConfigFromFile } from 'vite';
import type { SiteConfig, UserConfig } from '../shared/types/index';

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.ts', 'config.js'];
    const configPath = supportConfigFiles
      .map((file) => resolve(root, file))
      .find(fs.pathExistsSync);
    return configPath;
  } catch (e) {
    console.log('Failed to load user config');
    throw e;
  }
}

function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'Islas.js',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  };
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
) {
  // 1. 获取配置文件路径 支持ts、js格式
  const configPath = getUserConfigPath(root);
  // 2. 解析配置文件
  const result = await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  );
  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    // object | promise | function
    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);
    const siteConifg: SiteConfig = {
      root,
      configPath,
      siteData: resolveSiteData(userConfig as UserConfig)
    };
    return siteConifg;
  }
}

export function defineConfig(config: UserConfig): UserConfig {
  return config;
}
