import { join } from 'node:path';
import { runTsScript } from './run-program.js';

export interface CliMockResult {
  stdout: string;
  stderr: string;
  exitCode: number;
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
