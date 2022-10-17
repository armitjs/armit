import type { CommonOptions, ExecaChildProcess, ExecaReturnValue } from 'execa';
import { execa } from 'execa';

/**
 * Orgnization execa configuration
 * @param workCwd The working directory of this child process
 * @param opts overrides execa configuration
 *
 */
export const execaOpts = (
  workDir = process.cwd(),
  opts: CommonOptions<string>
): CommonOptions<string> => {
  return Object.assign(
    {
      cwd: workDir,
      localDir: workDir,
      preferLocal: workDir,
    },
    opts
  );
};

/**
 * Execute cli program
 * @param program the node program path.
 * @param workDir working directory
 * @param args the program parameters
 * @param opts the overrides execa configurations
 */
export const runProgram = (
  program: string,
  cwd: string,
  args: string[],
  opts: CommonOptions<string>
): ExecaChildProcess<string> => {
  return execa(program, args, execaOpts(cwd, opts));
};

/**
 * Pipe the child process stdout to the parent, this method only used to `jest test` purpose
 * Please manully install `ts-node`, `tsconfig-paths`
 * @param program exec node file `join(__dirname, 'cmd-cli.ts')`
 * @param tsconfig the configuration file `join(process.cwd(), '.vscode/tsconfig.json')`
 * @param options the configuration of `execa`
 * @param args parameters for program
 */
export const runTsScript = (
  program: string,
  tsconfig: string,
  options: CommonOptions<string>,
  ...args
): Promise<ExecaReturnValue<string>> => {
  return execa(
    'node',
    ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register', program].concat(
      args
    ),
    {
      env: {
        TS_NODE_PROJECT: tsconfig,
      },
      ...options,
    }
  );
};
