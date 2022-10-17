import { join } from 'path';
import { getDirname, runTsScript } from '@armit/common';

export interface CliMockResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function runCliMock(...args): Promise<CliMockResult> {
  const tsconfig = join(process.cwd(), './tsconfig.json');
  const program = join(getDirname(import.meta.url), 'cli-boot.ts');
  const result = await runTsScript(program, tsconfig, {}, ...args);
  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.exitCode,
  };
}
