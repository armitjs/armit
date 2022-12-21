import { createCli } from '../../create-cli.js';
import { cmdTest } from './cmd-test-builder.js';

export const waitCliHandler = <T>(...argv: string[]): Promise<T> => {
  return createCli({
    group: '@armit',
    exitProcess: true,
  })
    .register(cmdTest)
    .parseAsync<T>(argv);
};
