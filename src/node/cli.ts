import {cac} from 'cac';
import {createDevServer} from './dev';
import {build} from './build';
import { resolve } from 'path';

const version = require("../../package.json").version;

const cli = cac("shark").version(version).help();

// 调试 CLI:
// 1. 在 package.json 中声明 bin 字段
// 2. 通过 npm link 将命令 link 到全局
// 3. 执行 shark dev docs 命令

cli
  .command("dev [root]", "start dev server")
  .alias("dev")
  .action(async (root: string) => {
    // root = root ? path.resolve(root) : process.cwd();
    const server = await createDevServer(root);
    await server.listen();
    server.printUrls();
  })

cli
  .command("build [root]", "build project")
  .action(async (root: string) => {
    try {
      root = resolve(root);
      await build(root)
    } catch (error) {
      console.error(error);
    }
  })

cli.parse();