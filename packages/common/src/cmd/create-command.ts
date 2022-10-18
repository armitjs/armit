import type { PackageJson } from 'type-fest';
import type { Arguments, CommandModule } from 'yargs';
import { LogLevel, DefaultLogger } from '../logger/logger.js';

type ArgvPrimitive = string | number | boolean | PackageJson;

type ArgvConfig = Record<string, ArgvPrimitive | Array<ArgvPrimitive>>;

export type CommandArgv<T = ArgvConfig> = {
  /**
   * The name of runing command
   */
  name: string;
  /**
   * The cli package json parsed from `package.json`
   */
  packageJson: PackageJson;
  /**
   * The actived logging level
   */
  logLevel: keyof typeof LogLevel;
} & T;

interface OnCommandHandler<T extends CommandArgv> {
  handle(): void | Promise<void>;
  initialize(args: Arguments<T>): void;
  get name(): string;
  get cliPackageJson(): PackageJson;
}

interface CommandHandlerCtor<T extends CommandArgv> {
  new (args: Arguments<T>): AbstractHandler<T>;
}

export abstract class AbstractHandler<T extends CommandArgv>
  implements OnCommandHandler<T>
{
  protected logger: DefaultLogger = new DefaultLogger({
    level: LogLevel.Warn,
  });

  // Actived command name.
  private pluginName: string;
  private packageJson: PackageJson;

  constructor(protected args: Arguments<T>) {
    this.initialize(args);
    this.pluginName = args.name;
    this.packageJson = args.packageJson;
    this.logger.setDefaultContext(args.name);
  }

  initialize(args: Arguments<T>): void {
    this.logger.setLevel(LogLevel[args.logLevel]);
  }

  get cliPackageJson(): PackageJson {
    return this.packageJson;
  }

  get name(): string {
    return this.pluginName;
  }

  handle(): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
}

/**
 * Allow us create an customized command based on yargs
 * @example
 * ```ts
 *  import type { CommandArgv } from '@armit/common';
 *  import { createCommand, AbstractHandler } from '@armit/common';
 *
 *  type TestCmdArgs = CommandArgv<{
 *    test: number;
 *  }>;
 *
 *  class CmdTestHandle extends AbstractHandler<TestCmdArgs> {
 *    get name(): string {
 *      return `test`;
 *    }
 *    handle(): void | Promise<void> {
 *      console.log('this is test command');
 *    }
 *  }
 *
 *  export const cmdTest = createCommand(
 *    'info',
 *    {
 *      command: 'info',
 *      describe: 'Display armit project details.',
 *      builder: (yargs) => {
 *        return yargs.example(`$0 cmd test `, 'cli testing').option('test', {
 *          type: 'number',
 *          alias: '',
 *          default: true,
 *          describe: `cli option "test" describe`,
 *        });
 *      },
 *    },
 *    CmdTestHandle
 *  );
 *  ```
 * @param name The name of this command plugin
 * @param declare The definitions of this command using yargs
 * @param ctor The constraint command handler
 */
export const createCommand = <T extends CommandArgv>(
  name: string,
  declare: Omit<CommandModule<T>, 'handler'>,
  ctor: CommandHandlerCtor<T>
): CommandModule<T> => {
  return {
    ...declare,
    handler(args) {
      const handler = new ctor({ ...(args as Arguments<T>), name });
      return handler.handle.call(handler);
    },
  };
};
