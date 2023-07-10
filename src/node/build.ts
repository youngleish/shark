import {build as viteBuild, InlineConfig, Rollup} from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './const';
import {join} from 'node:path';
import type {RollupOutput} from 'rollup';
import * as fs from 'fs-extra';
/** 
 * 生产构建逻辑
 * 1. 代码打包，生成2份bundle产物，分别运行在 client 和 server 端
 * 2. 引入 server-entry.js 作为服务端入口文件
 * 3. 服务端渲染，产出HTML
 */

export async function bundle(root: string) {
  // 提取公共代码部分
  const resolveViteConfig = (isServer = false): InlineConfig => ({
    mode: 'production',
    root,
    build: {
      ssr: isServer,
      outDir: isServer ? '.serverTemp' : 'build',
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: isServer ? {
          format: 'cjs',
          entryFileNames: '[name].js',
          
        } : {
          format: 'esm',
        },
      },
    },
  })

  console.log(`Building client + server bundles...`)

  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig()),
      viteBuild(resolveViteConfig(true)),
    ])
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch (error) {
    console.error(error);
  }
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput,
) {
  // 调用render方法获取html文件
  const appHtml = render();
  // 实现ssr文件事件交互：hydration
  const clientChunk = clientBundle.output.find((chunk) => chunk.type === 'chunk' && chunk.isEntry === true);
  // 拼接HTML内容
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <div id="root">${appHtml} </div>
      <script type="module" src="${clientChunk.fileName}"></script>
    </body>
  </html>
  `.trim();
  // html 文件写入磁盘
  await fs.writeFile(join(root, 'build', 'index.html'), html, 'utf-8');
  // 删除 临时文件 .serverTemp
  await fs.remove(join(root, '.serverTemp'));

}

export async function build(root: string) {
  // 1. 代码打包
  const [clientBundle] = await bundle(root);
  
  // 2. 引入打包后的server-entry.js 作为服务端入口文件
  const serverEntry = join(root, ".serverTemp", "ssr-entry.js");
  const  {render} = require(serverEntry);
  // 3. 服务端渲染，产出HTML
  await renderPage(render, root, clientBundle)
}