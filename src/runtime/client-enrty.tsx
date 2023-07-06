/** 浏览器端入口文件: 渲染主题组件 */
import {createRoot} from 'react-dom/client';
import { App } from './App';

function renderInBrowser() {
  // 1. 获取root元素
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('#root element not found');
  }
  // 2. 渲染主题组件
  createRoot(root).render(<App />);
}

renderInBrowser()
