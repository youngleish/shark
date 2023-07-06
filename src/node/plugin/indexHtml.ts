import {readFile} from 'fs/promises';
import {Plugin} from 'vite';

export function PluginIndexHtml(): Plugin {
  return {
    name: 'shark:index-html',
    apply: 'serve',
    configureServer(server) {
      return () => {
        // 中间件server逻辑放在回调函数中： 避免影响vite内置的中间件功能，所以放在最后面
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/') {
            // 1. 读取index.html文件
            let html = await readFile('./index.html', 'utf-8');
            // 2. 转换 html 代码，返回转换后的代码字符串
            html = await server.transformIndexHtml(req.url, html, req.originalUrl)
            // 3. 响应HTML 浏览器内容给浏览器
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
          } else {
            next();
          }
        })
      }
    }
  }
}