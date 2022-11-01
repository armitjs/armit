import { join } from 'path';
import { getDirname, getPackageData } from '@armit/common';
import { runCliMock } from '@/test-utils/cli-run-mock.js';

describe('@armit/cli info', () => {
  const curDirName = getDirname(import.meta.url);
  const program = join(curDirName, 'cli-boot.ts');

  // Read cli package json data.
  const packageJson = getPackageData({
    cwd: curDirName,
  });

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

  it('Should correct print armit cli related information', async () => {
    const { stdout } = await runCliMock(program, 'info');
    const stdoutStrs: string[] = [
      'CLI tool for armitjs applications',
      '✔ System Information',
      'OS Version',
      'NodeJS Version',
      '✔ @armit CLI',
      `@armit CLI Version : ${packageJson?.version || ''}`,
      `✔ @armit Platform Information`,
      `eslint-config-bases ➞ version :`,
      `common ➞ version              :`,
    ];

    for (const str of stdoutStrs) {
      expect(stdout).toStrictEqual(expect.stringContaining(str));
    }
  });
});
