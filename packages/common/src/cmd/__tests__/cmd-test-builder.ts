import type { CommandArgv } from '@armit/common';
import { showBanner, createCommand, AbstractHandler } from '@armit/common';

type TestCmdArgs = CommandArgv<{
  test: number;
}>;

class CmdTestHandle extends AbstractHandler<TestCmdArgs> {
  get name(): string {
    return `test`;
  }
  handle(): void | Promise<void> {
    console.log('this is test command');
    showBanner(`armit`, {});
  }
}

export const cmdTest = createCommand(
  'info',
  {
    command: 'info',
    describe: 'Display armit project details.',
    builder: (yargs) => {
      return yargs.example(`$0 cmd test `, 'cli testing').option('test', {
        type: 'number',
        alias: '',
        default: true,
        describe: `cli option "test" describe`,
      });
    },
  },
  CmdTestHandle
);
