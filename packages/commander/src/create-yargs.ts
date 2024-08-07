import type { Argv } from 'yargs';
import yargs from 'yargs';
import { Logger, LogLevel } from '@armit/logger';
import { StdoutAdapter, TerminalFormatStrategy } from '@armit/logger-node';
import { getTerminalLink, terminalColor } from '@armit/terminal';

/**
 * A context object can optionally be given as the second argument to parse()
 * Providing a useful mechanism for passing state information to commands
 */
export interface CliOption {
  /**
   * The group name
   * @default `@armit`
   */
  group: string;
  /**
   * the json parsed from `package.json`
   */
  packageJson?: Record<string, unknown>;
  /**
   * By default, yargs exits the process when the user passes a help flag, the user uses the .version functionality,
   * Calling .exitProcess(false) disables this behavior, enabling further actions after yargs have been validated.
   */
  exitProcess?: boolean;
}

const logger = new Logger({
  logLevel: LogLevel.Warn,
  adapter: new StdoutAdapter({
    formatStrategy: new TerminalFormatStrategy(),
  }),
});

const errorHandler =
  (option: CliOption) => (msg: string, err: string | Error, yargsIns: Argv) => {
    let actual = err || new Error(msg);
    if (typeof actual === 'string') {
      actual = new Error(actual);
    }
    // Makesure that we have always have `message` property error we throw.
    if (actual.message?.includes('Did you mean') && yargsIns.parsed) {
      logger.error(
        `Unknown command "${yargsIns.parsed.argv.$0}"`,
        option.group
      );
    }
    logger.error(actual.message, option.group, actual.stack);
    if (option.exitProcess !== false) {
      process.exit(1);
    }
  };

const globalOptions = () => {
  return yargs()
    .option('log-level', {
      type: 'string',
      default: 'Info',
      choices: ['Error', 'Warn', 'Info', 'Verbose', 'Debug'],
      describe: `What level of logs to report. `,
    })
    .option('no-color', {
      type: 'boolean',
      default: false,
      describe: `Removes colors from the console output.`,
    });
};

export const createYargs = (option: CliOption) => {
  return (
    globalOptions()
      .group(['help', 'version', 'log-level', 'no-color'], 'Globals: ')
      .usage(`Usage: $0 <command> [options]`)
      .recommendCommands()
      .demandCommand(
        1,
        `${terminalColor(['bgBlack', 'red'], false)('ERR!')} ${terminalColor(
          ['bold', 'red'],
          false
        )(
          ' A command is required. Pass --help to see all available commands and options.\n'
        )}
      `
      )
      .fail(errorHandler(option))
      // Note: .exitProcess(false) should not be used
      // when .command() is called with a handler returning a promise,
      // as it would lead to a duplicated error message when this promise rejects
      .exitProcess(option.exitProcess !== false)
      .locale('en')
      .updateStrings({
        command: terminalColor(['cyan'], false)('command'),
      })
      .strict()
      .alias('h', 'help')
      .alias('l', 'log-level')
      .alias('v', 'version')
      .epilog(
        `Copyright 2023 ${getTerminalLink(
          terminalColor(['bold', 'magenta'], false)(option.group),
          'https://github.com/armitjs/armit'
        )} `
      )
      .wrap(null)
  );
};
