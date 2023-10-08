import { useState, useEffect } from 'react';
import { Header } from 'shared/types/index';

export function useHeaders(initHeaders: Header[], pagePath: string) {
  const [headers, setHeaders] = useState(initHeaders);

  useEffect(() => {
    if (import.meta.env.DEV) {
      import.meta.hot?.on(
        'md(x)-changed',
        ({ filePath }: { filePath: string }) => {
          if (filePath !== pagePath) {
            return;
          }
          // console.log('更新文件的路径', filePath);
          import(/* @vite-ignore */ `${filePath}?import&t=${Date.now()}`).then(
            (module) => {
              setHeaders(module.toc);
            }
          );
        }
      );
    }
  }, [pagePath]);
  return headers;
}
