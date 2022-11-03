import { join } from 'path';
import { getDirname } from '@armit/common';
import { runCliMock } from '@/test-utils/cli-run-mock.js';

describe('@armit/cli info', () => {
  const curDirName = getDirname(import.meta.url);
  const program = join(curDirName, 'cli-boot.ts');

  it('Should output correct `version` -v', async () => {
    const { stdout } = await runCliMock(program, '-h');
    expect(stdout).toStrictEqual(
      expect.stringContaining(`Usage: cli-boot.ts <command> [options]`)
    );
    expect(stdout).toStrictEqual(expect.stringContaining(`Commands:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`cli-boot.ts new`));
    expect(stdout).toStrictEqual(expect.stringContaining(`Globals:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-h, --help`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-v, --version`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-l, --logLevel`));
    expect(stdout).toStrictEqual(expect.stringContaining(`Copyright 2022`));
  });
});
