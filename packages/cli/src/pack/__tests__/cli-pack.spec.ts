import { join } from 'path';
import { getDirname, rmrfSync, unzip } from '@armit/file-utility';
import { runTsScript } from '@hyperse/exec-program';

describe('@armit/cli pack', () => {
  const fixtureCwd = getDirname(import.meta.url);
  const program = join(fixtureCwd, 'cli-boot.ts');

  beforeAll(async () => {
    await unzip(join(fixtureCwd, 'cli-test-project.zip'), join(fixtureCwd));
  });

  afterAll(() => {
    rmrfSync(join(fixtureCwd, 'public'));
    rmrfSync(join(fixtureCwd, 'packages'));
  });

  it('Should output correct `version` -v', async () => {
    const { stdout } = await runTsScript(program, {}, '-h', '--noColor');
    expect(stdout).toStrictEqual(
      expect.stringContaining(`Usage: cli-boot.ts <command> [options]`)
    );
    expect(stdout).toStrictEqual(expect.stringContaining(`Commands:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`cli-boot.ts pack`));
    expect(stdout).toStrictEqual(expect.stringContaining(`Globals:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-h, --help`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-v, --version`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-l, --log-level`));
    expect(stdout).toStrictEqual(expect.stringContaining(`Copyright 2023`));
  });

  it('Should correct handle default options `**`', async () => {
    const { stdout } = await runTsScript(
      program,
      {},
      'pack',
      '-c',
      fixtureCwd,
      '--noColor'
    );
    const matchedStrs: string[] = [
      '✔ All ziped files',
      ' ➩ project/module-a/bundle57ee0d7b872138242b97-a.css',
      ' ➩ project/module-a/bundle72585ddf7e0d0137cff2-a.js',
      ' ➩ project/module-a/index-dev.html',
      ' ➩ project/module-a/index.html',
      ' ➩ project/module-b/bundle57ee0d7b872138242b97-b.css',
      ' ➩ project/module-b/bundle72585ddf7e0d0137cff2-b.js',
      ' ➩ project/module-b/index-dev.html',
      ' ➩ project/module-b/index.html',
    ];
    for (const str of matchedStrs) {
      expect(stdout).toStrictEqual(expect.stringContaining(str));
    }
  });
  it('Should correct handle filter pattern', async () => {
    const { stdout } = await runTsScript(
      program,
      {},
      'pack',
      '-f',
      'project/module-a/**',
      '-c',
      fixtureCwd,
      '--noColor'
    );
    const matchedStrs: string[] = [
      '✔ All ziped files',
      ' ➩ project/module-a/bundle57ee0d7b872138242b97-a.css',
      ' ➩ project/module-a/bundle72585ddf7e0d0137cff2-a.js',
      ' ➩ project/module-a/index-dev.html',
      ' ➩ project/module-a/index.html',
    ];
    for (const str of matchedStrs) {
      expect(stdout).toStrictEqual(expect.stringContaining(str));
    }
  });
  it('Should correct handle semicolon `;` filter', async () => {
    const { stdout } = await runTsScript(
      program,
      {},
      'pack',
      '-f',
      '**/module-a/**;project/module-b/**',
      '-c',
      fixtureCwd,
      '--noColor'
    );
    const matchedStrs: string[] = [
      '✔ All ziped files',
      ' ➩ project/module-a/bundle57ee0d7b872138242b97-a.css',
      ' ➩ project/module-a/bundle72585ddf7e0d0137cff2-a.js',
      ' ➩ project/module-a/index-dev.html',
      ' ➩ project/module-a/index.html',
      ' ➩ project/module-b/bundle57ee0d7b872138242b97-b.css',
      ' ➩ project/module-b/bundle72585ddf7e0d0137cff2-b.js',
      ' ➩ project/module-b/index-dev.html',
      ' ➩ project/module-b/index.html',
    ];
    for (const str of matchedStrs) {
      expect(stdout).toStrictEqual(expect.stringContaining(str));
    }
  });

  it('Should default ignore `**/*.{png,jpg,jpeg,gif,svg}`', async () => {
    const { stdout } = await runTsScript(
      program,
      {},
      'pack',
      '-c',
      fixtureCwd,
      '--noColor'
    );
    expect(stdout).toStrictEqual(
      expect.not.stringContaining(
        'project/module-b/assets/module-8ca86e6b-a.jpg'
      )
    );
    expect(stdout).toStrictEqual(
      expect.not.stringContaining(
        'project/module-b/assets/module-8ca86e6b-a.png'
      )
    );
  });

  it('Should allow customized `ignore` pattern', async () => {
    const { stdout } = await runTsScript(
      program,
      {},
      'pack',
      '-i',
      '**/*.svg',
      '--ignore',
      '**/*.jpg',
      '-c',
      fixtureCwd,
      '--noColor'
    );
    expect(stdout).toStrictEqual(
      expect.not.stringContaining(
        'project/module-b/assets/module-8ca86e6b-a.jpg'
      )
    );
    expect(stdout).toStrictEqual(
      expect.stringContaining('project/module-b/assets/module-8ca86e6b-a.png')
    );
  });
});
