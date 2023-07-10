// 服务端入口： 把组件渲染为html字符
import {App} from './App';
import {renderToString} from 'react-dom/server';

export const render = () => {
  return renderToString(<App />);
}
