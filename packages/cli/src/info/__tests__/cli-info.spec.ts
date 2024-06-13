import { join } from 'path';
import { getDirname } from '@armit/file-utility';
import { readPackageData } from '@armit/package';
import { runTsScript } from '@hyperse/exec-program';

describe('@armit/cli info', () => {
  const curDirName = getDirname(import.meta.url);
  const program = join(curDirName, 'cli-boot.ts');

  // Read cli package json data.
  const packageJson = readPackageData({
    cwd: curDirName,
  });

  it('Should correct print armit cli related information', async () => {
    const { stdout } = await runTsScript(program, ['info', '--noColor']);
    const stdoutStrs: string[] = [
      'CLI tool for armitjs applications',
      'System Information',
      'OS Version',
      'NodeJS Version',
      '@armit CLI',
      `@armit CLI Version : ${packageJson?.version || ''}`,
      `@armit Platform Information`,
      `generate-template-files ➞ version`,
      `commander ➞ version`,
      `terminal ➞ version`,
      `package ➞ version`,
    ];
    for (const str of stdoutStrs) {
      expect(stdout).toEqual(expect.stringMatching(str));
    }
  });
});
