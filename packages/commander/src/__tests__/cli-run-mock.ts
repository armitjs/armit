import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runTsScript } from '../run-program.js';

export interface CliMockResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}
const getDirname = (url: string, subDir = '') => {
  return join(dirname(fileURLToPath(url)), subDir);
};

export async function runCliMock(...args: string[]): Promise<CliMockResult> {
  const program = join(getDirname(import.meta.url), 'cli-boot.ts');
  return runTsProgram(program, ...args);
}

export async function runArgvParseMock(
  ...args: string[]
): Promise<CliMockResult> {
  const program = join(getDirname(import.meta.url), 'cli-argv-parse.ts');
  return runTsProgram(program, ...args);
}

export async function runTsProgram(
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
