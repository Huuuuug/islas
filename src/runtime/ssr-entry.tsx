// 服务端入口文件
import { App } from './App';
import { renderToString } from 'react-dom/server';

export function render() {
  return renderToString(<App />);
}
