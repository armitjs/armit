import { join } from 'node:path';
import { getDirname } from '@/test-utils';
import { runTsScript } from '@hyperse/exec-program';

describe('parse process arguments using yargs', () => {
  it('Should correct parse process argv', async () => {
    const program = join(
      getDirname(import.meta.url),
      'fixtures/cli-argv-parse.ts'
    );
    const { stdout } = await runTsScript(program, [
      'create-reduce-action',
      '__store__=some-name',
      '__model__=some-other-name',
      '--outputpath=./src/here',
      '--overwrite',
    ]);
    // ./tools/generate.js create-reduce-action __store__=some-name __model__=some-other-name --outputpath=./src/here --overwrite
    expect(stdout).toStrictEqual(expect.stringContaining(`_: [`));
    expect(stdout).toStrictEqual(
      expect.stringContaining(`'create-reduce-action',`)
    );
    expect(stdout).toStrictEqual(
      expect.stringContaining(`'__store__=some-name',`)
    );
    expect(stdout).toStrictEqual(
      expect.stringContaining(`'__model__=some-other-name'`)
    );
    expect(stdout).toStrictEqual(
      expect.stringContaining(`outputpath: './src/here',`)
    );
    expect(stdout).toStrictEqual(expect.stringContaining(`overwrite: true,`));
  });
});
