import { join } from 'node:path';
import { runTsCliMock } from '@armit/commander';
import type { CliMockResult } from '@armit/commander';
import { getDirname } from '@armit/file-utility';

async function runCliMock(...args: string[]): Promise<CliMockResult> {
  const program = join(getDirname(import.meta.url), 'cli-boot.ts');
  return runTsCliMock(program, ...args);
}

describe('@armit/cli bootstrap', () => {
  const curDirName = getDirname(import.meta.url);

  const program = join(curDirName, 'cli-boot.ts');

  it('Should output correct `version` -v', async () => {
    const { stdout } = await runCliMock(program, '-h');
    expect(stdout).toStrictEqual(
      expect.stringContaining(`Usage: cli-boot.ts <command> [options]`)
    );
    expect(stdout).toStrictEqual(expect.stringContaining(`Commands:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`cli-boot.ts info`));
    expect(stdout).toStrictEqual(expect.stringContaining(`Globals:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-h, --help`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-v, --version`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-l, --logLevel`));
    expect(stdout).toStrictEqual(expect.stringContaining(`Copyright 2022`));
  });
});
