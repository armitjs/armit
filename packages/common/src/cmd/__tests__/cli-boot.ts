import { createCli } from '../create-cli.js';
import { cmdTest } from './cmd-test-builder.js';

void createCli({
  group: '@armit',
  exitProcess: true,
})
  .register(cmdTest)
  .parse(process.argv.slice(2));
