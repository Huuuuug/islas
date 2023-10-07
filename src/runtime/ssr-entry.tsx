// 服务端入口文件
import { App } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

export function render(pagePath: string) {
  return renderToString(
    <StaticRouter location={pagePath}>
      <App />
    </StaticRouter>
  );
}

export { routes } from 'islas:routes';
