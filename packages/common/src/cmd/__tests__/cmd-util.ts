import { join } from 'path';
import { getDirname } from '../../index.js';
import { runTsScript } from '../../terminal/index.js';

export interface CliMockResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function runCliMock(...args): Promise<CliMockResult> {
  try {
    const tsconfig = join(process.cwd(), './tsconfig.json');
    const program = join(getDirname(import.meta.url), 'cli-boot.ts');
    const result = await runTsScript(program, 'esm', tsconfig, {}, ...args);
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    };
  } catch (err) {
    return err as CliMockResult;
  }
}
