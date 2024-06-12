import type { Argv, CommandModule, ParseCallback } from 'yargs';
import type { CliOption } from './create-yargs.js';
import { createYargs } from './create-yargs.js';

export class CliMain {
  private options: CliOption;
  private commands: CommandModule[] = [];
  private program: Argv;
  constructor(options: CliOption) {
    this.options = options;
    this.program = createYargs(this.options);
  }
  /**
   * Register new command module to chain.
   * Note Normally we can register only one command, because the T maybe different.
   * @param command The CommandModule
   */
  public register(...cmds: CommandModule<any, any>[]): CliMain {
    cmds.forEach((cmd) => {
      this.commands.push(cmd);
    });
    return this;
  }
  /**
   * Parse args instead of process.argv. Returns the argv object. args may either be a pre-processed argv array, or a raw argument string.
   * @param argv procces.argv.slice(2)
   */
  public parse(argv: string[], callback?: ParseCallback) {
    this.program = this.commands.reduce(
      (program, cmd) => program.command(cmd),
      this.program
    );
    return this.program.parse(argv, this.options, callback);
  }

  /**
   * Identical to .parse() except always returns a promise for a parsed argv object, regardless of whether an async builder, handler, or middleware is used.
   * @param argv procces.argv.slice(2)
   * @param callback
   * @returns
   */
  public parseAsync<T>(argv: string[], callback?: ParseCallback): Promise<T> {
    this.program = this.commands.reduce(
      (program, cmd) => program.command(cmd),
      this.program
    );
    return this.program
      .parseAsync(argv, this.options, callback)
      .then((result) => {
        return result as unknown as T;
      });
  }

  /**
   * Manually indicate that the program should exit, and provide context about why we wanted to exit.
   */
  public exitProcess(code: number, err: Error): void {
    this.program.exit(code, err);
  }
}

/**
 * Create cli program
 * @param options
 * @returns
 */
export const createCli = (options: CliOption) => {
  return new CliMain(options);
};
