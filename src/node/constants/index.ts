import * as path from 'path';
// 项目根目录
export const PACKAGE_ROOT = path.join(__dirname, '..');

export const CLIENT_ENTRY_PATH = path.join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'client-entry.tsx'
);
export const SERVER_ENTRY_PATH = path.join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'ssr-entry.tsx'
);

export const DEFAULT_TEMPLATE_PATH = path.join(PACKAGE_ROOT, 'template.html');
