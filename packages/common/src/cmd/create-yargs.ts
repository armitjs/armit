import type { Argv, CommandModule } from 'yargs';
import yargs from 'yargs';
import { DefaultLogger, LogLevel } from '../logger/logger.js';
import { terminalColor } from '../terminal/terminal-color.js';
import { getTerminalLink } from '../terminal/terminal-link.js';

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

const logger = new DefaultLogger({
  level: LogLevel.Warn,
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
  return yargs().options({
    logLevel: {
      type: 'string',
      default: 'Info',
      choices: ['Error', 'Warn', 'Info', 'Verbose', 'Debug'],
      describe: `What level of logs to report. `,
    },
    noColor: {
      type: 'boolean',
      default: false,
      describe: `Removes colors from the console output.`,
    },
  });
};

export const createYargs = (option: CliOption) => {
  return (
    globalOptions()
      .group(['help', 'version', 'logLevel', 'noColor'], 'Globals: ')
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
      .alias('l', 'logLevel')
      .alias('v', 'version')
      .epilog(
        `Copyright 2022 ${getTerminalLink(
          terminalColor(['bold', 'magenta'], false)(option.group),
          'https://github.com/armitjs/armit'
        )} `
      )
      .wrap(null)
  );
};

/**
 * Provides a standard mechanism for creating subcommands
 * @param program the main command
 * @param commands subcommand list
 */
export const createYargsSubCommands = (
  program: Argv,
  ...commands: CommandModule[]
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
