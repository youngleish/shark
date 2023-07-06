import { createServer as createViteDevServer } from "vite";
import {PluginIndexHtml} from './plugin/indexHtml';

export async function createDevServer(root = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [
      PluginIndexHtml()
    ]
  });
}