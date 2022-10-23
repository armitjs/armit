import { join } from 'path';
import { runTsScript } from '@armit/common';

export interface CliMockResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function runCliMock(
  programPath: string,
  ...args: string[]
): Promise<CliMockResult> {
  try {
    const tsconfig = join(process.cwd(), './tsconfig.json');
    const result = await runTsScript(programPath, 'esm', tsconfig, {}, ...args);
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    };
  } catch (err) {
    return err as CliMockResult;
  }
}
