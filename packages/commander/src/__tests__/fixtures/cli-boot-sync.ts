import { createCli } from '../../create-cli.js';
import { cmdTest } from './cmd-test-builder.js';
import { cmdNestTest } from './cmd-test-nest-builder.js';

createCli({
  group: '@armit',
  exitProcess: false,
})
  .register(cmdTest)
  .register(cmdNestTest)
  .parse(process.argv.slice(2));
