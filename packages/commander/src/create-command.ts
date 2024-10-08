import type { PackageJson } from 'type-fest';
import type { Arguments, Argv, CommandModule } from 'yargs';
import { Logger, LogLevel } from '@armit/logger';
import { StdoutAdapter, TerminalFormatStrategy } from '@armit/logger-node';
import { terminalColor } from '@armit/terminal';

type ArgvPrimitive = string | number | boolean | Record<string, unknown>;

type ArgvConfig = Record<string, ArgvPrimitive | Array<ArgvPrimitive>>;

export type CommandArgv<T extends ArgvConfig = ArgvConfig> = {
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
   * @default 'Info'
   */
  logLevel: keyof typeof LogLevel;
  /**
   * Removes colors from the console output
   * @default false
   */
  noColor: boolean;
} & T;

interface OnCommandHandler {
  /**
   * The `CommanderHandler` class should inherit and implment this function
   * @override
   */
  handle(): void | Promise<void>;
  /**
   * The `CommanderHandler` class should inherit and implment this function
   * @override
   */
  initialize(): void;
  get name(): string;
  get cliPackageJson(): PackageJson;
}

interface CommandHandlerCtor<T extends CommandArgv> {
  new (args: Arguments<T>): AbstractHandler<T>;
}

export abstract class AbstractHandler<T extends CommandArgv>
  implements OnCommandHandler
{
  protected logger: Logger<any> = new Logger({
    logLevel: LogLevel.Info as LogLevel,
    adapter: new StdoutAdapter({
      formatStrategy: new TerminalFormatStrategy({
        showLevelName: true,
        showTimestamp: true,
        showRelativeTimestamp: false,
        showContext: false,
        showTimestampRelativeToLastLog: false,
        use24HourClock: true,
      }),
    }),
  });

  // Actived command name.
  private pluginName: string;
  private packageJson: PackageJson;

  constructor(protected args: Arguments<T>) {
    this.pluginName = args.name;
    this.packageJson = args.packageJson;
    this.updateLogger(args);
    this.initialize();
  }

  updateLogger(args: Arguments<T>): void {
    this.logger = new Logger({
      logLevel: LogLevel[args.logLevel] as LogLevel,
      context: args.name,
      adapter: new StdoutAdapter({
        formatStrategy: new TerminalFormatStrategy({
          showLevelName: true,
          showTimestamp: true,
          showRelativeTimestamp: false,
          showContext: false,
          showTimestampRelativeToLastLog: false,
          use24HourClock: true,
          noColor: args.noColor,
        }),
      }),
    });
    this.logger.debug(`The loaded cli args:\n${JSON.stringify(args, null, 2)}`);
  }

  /**
   * The helper function to ensure the message is a string type
   * @param message The message to be ensured, error, string, any object
   * @returns
   */
  protected stringifyError(message: any): string {
    return typeof message === 'string'
      ? message
      : message instanceof Error
        ? message.toString()
        : JSON.stringify(message, null, 2);
  }

  get cliPackageJson(): PackageJson {
    return this.packageJson;
  }

  get name(): string {
    return this.pluginName;
  }

  /**
   * The `CommanderHandler` class should inherit and implment this function,
   * @example
   * ```ts
   * console.log(this.args.logLevel)
   * ```
   * @override
   */
  initialize(): void {
    //
  }
  /**
   * The `CommanderHandler` class should inherit and implment this function
   * @override
   */
  handle(): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
}

/**
 * Allow us create an customized command based on yargs
 * @example
 * ```ts
 *  import type { CommandArgv } from '@armit/commander';
 *  import { createCommand, AbstractHandler } from '@armit/commander';
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

/**
 * Provides a standard mechanism for creating subcommands
 * @param program the main command
 * @param commands subcommand list
 */
export const createSubCommands = (
  program: Argv,

  ...commands: CommandModule<any, any>[]
): Argv => {
  program = commands.reduce((program, cmd) => program.command(cmd), program);
  return program.demandCommand(
    1,
    `${terminalColor(['bgBlack', 'red'], false)('ERR!')} ${terminalColor(
      ['bold', 'red'],
      false
    )(
      ' A sub-command is required. Pass --help to see all available sub-commands and options.\n'
    )}
  `
  );
};
