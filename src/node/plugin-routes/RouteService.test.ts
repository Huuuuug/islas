import { RouteService } from './RouteService';
import { describe, expect, test } from 'vitest';
import path from 'path';
import { normalizePath } from 'vite';

describe('RouteService', async () => {
  const testDir = normalizePath(path.join(__dirname, '../../../docs'));

  const routeService = new RouteService(testDir);
  await routeService.init();

  test('conventional route by file structure', () => {
    const routeMeta = routeService.getRouteMeta().map((item) => ({
      ...item,
      absolutePath: item.absolutePath.replace(testDir, 'TEST_DIR')
    }));
    expect(routeMeta).toMatchInlineSnapshot(`
      [
        {
          "absolutePath": "TEST_DIR/b.tsx",
          "routePath": "/b",
        },
        {
          "absolutePath": "TEST_DIR/guide/a.tsx",
          "routePath": "/guide/a",
        },
        {
          "absolutePath": "TEST_DIR/guide/index.tsx",
          "routePath": "/guide/",
        },
      ]
    `);
  });
  test('generate routes code', async () => {
    expect(routeService.generateRoutesCode().replaceAll(testDir, 'TEST_DIR'))
      .toMatchInlineSnapshot(`
      "
        import React from 'react';
        import loadable from '@loadable/component';
        const Route0 = loadable(() => import('TEST_DIR/b.tsx'));
      const Route1 = loadable(() => import('TEST_DIR/guide/a.tsx'));
      const Route2 = loadable(() => import('TEST_DIR/guide/index.tsx'));
        export const routes = [
        { path: '/b', element: React.createElement(Route0) },
      { path: '/guide/a', element: React.createElement(Route1) },
      { path: '/guide/', element: React.createElement(Route2) }
        ];
        "
    `);
  });
});
