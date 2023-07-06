import { createServer as createViteDevServer } from "vite";
import {PluginIndexHtml} from './plugin/indexHtml';
import pluginReact from '@vitejs/plugin-react';

export async function createDevServer(root = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [
      PluginIndexHtml(),
      pluginReact()
    ]
  });
}