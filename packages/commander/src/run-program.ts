import { join } from 'node:path';
import type { CommonOptions, ExecaChildProcess, ExecaReturnValue } from 'execa';
import { execa } from 'execa';

/**
 * Orgnization execa configuration
 * @param workCwd The working directory of this child process
 * @param opts overrides execa configuration
 *
 */
const execaOpts = (
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
 * @param mode esm or commonjs
 * @param tsconfig the configuration file `join(process.cwd(), './tsconfig.json')`
 * @param options the configuration of `execa`
 * @param args parameters for program
 */
export const runTsScript = (
  program: string,
  mode: 'esm' | 'commonjs',
  tsconfig: string,
  options: CommonOptions<string>,
  ...args
): Promise<ExecaReturnValue<string>> => {
  const commonjsArgs =
    mode === 'commonjs'
      ? ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register']
      : // FIXME: Add path mapping support to ESM and CJS loaders https://github.com/TypeStrong/ts-node/pull/1585
        // ['--loader', 'ts-node/esm', '--no-warnings'];
        ['--loader', '@armit/path-alias/esm', '--no-warnings'];

  return execa('node', commonjsArgs.concat(program, ...args), {
    env: {
      TS_NODE_PROJECT: tsconfig,
    },
    ...options,
  });
};

export interface CliMockResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function runTsCliMock(
  program,
  ...args: string[]
): Promise<CliMockResult> {
  try {
    const tsconfig = join(process.cwd(), './tsconfig.json');
    const result = await runTsScript(
      program,
      'esm',
      tsconfig,
      {},
      ...args,
      '--noColor'
    );
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    };
  } catch (err) {
    return err as CliMockResult;
  }
}
