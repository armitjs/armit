import { join } from 'path';
import { jest } from '@jest/globals';
import { readJsonFromFile } from '../../file/file-write.js';
import { runCliMock } from './cmd-util.js';

describe('@flatjs/common/cmd', () => {
  jest.setTimeout(60 * 1000 * 20);

  describe('cli basic infrusture', () => {
    const packagePath = join(process.cwd(), './package.json');

    it('Should output correct `version` -v', async () => {
      const { stdout } = await runCliMock('-v');
      const pkgJson = readJsonFromFile<{ version: string }>(packagePath);
      expect(stdout).toStrictEqual(expect.stringContaining(pkgJson.version));
    });

    it('Should output correct `help` -h', async () => {
      const { stdout } = await runCliMock('-h');
      expect(stdout).toStrictEqual(
        expect.stringContaining(`Usage: cli-boot.ts <command> [options]`)
      );
      expect(stdout).toStrictEqual(expect.stringContaining(`Commands:`));
      expect(stdout).toStrictEqual(expect.stringContaining(`cli-boot.ts test`));
      expect(stdout).toStrictEqual(
        expect.stringContaining(`cli-boot.ts error`)
      );
      expect(stdout).toStrictEqual(expect.stringContaining(`Globals:`));
      expect(stdout).toStrictEqual(expect.stringContaining(`-h, --help`));
      expect(stdout).toStrictEqual(expect.stringContaining(`-v, --version`));
      expect(stdout).toStrictEqual(expect.stringContaining(`-l, --logLevel`));
      expect(stdout).toStrictEqual(
        expect.stringContaining(`Copyright 2020 @flatjs`)
      );
    });
  });
});
