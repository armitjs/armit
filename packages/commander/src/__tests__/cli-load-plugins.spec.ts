import { rmSync } from 'node:fs';
import { createFixtureFiles } from '@/test-utils';
import { loadCliPlugins } from '../cli-load-plugins.js';

describe('load cli command plugins', () => {
  let fixtureCwd;

  beforeAll(() => {
    fixtureCwd = createFixtureFiles(import.meta.url, 'plugins', {
      // `@armit/cli-plugin-a`
      'node_modules/@armit/cli-plugin-a/package.json':
        '{"name":"@armit/cli-plugin-a","version":"0.0.1","main":"index.js"}',
      'node_modules/@armit/cli-plugin-a/index.js': 'console.log("a")',

      // `@armit/cli-plugin-b`
      'node_modules/@armit/cli-plugin-b/package.json':
        '{"name":"@armit/cli-plugin-b","version":"0.0.1","main":"index.js"}',
      'node_modules/@armit/cli-plugin-b/index.js': 'console.log("b")',

      // `armit-cli-plugin-a`
      'node_modules/armit-cli-plugin-a/package.json':
        '{"name":"armit-cli-plugin-a","version":"0.0.1","main":"index.js"}',
      'node_modules/armit-cli-plugin-a/index.js': 'console.log("c")',

      // `armit-cli-plugin-b`
      'node_modules/armit-cli-plugin-b/package.json':
        '{"name":"armit-cli-plugin-b","version":"0.0.1","main":"index.js"}',
      'node_modules/armit-cli-plugin-b/index.js': 'console.log()',

      // `armit-cli-plugin-b`
      'node_modules/cjs/package.json':
        '{"name":"cjs","version":"0.0.1","main":"index.js"}',
      'node_modules/cjs/index.js': 'module.exports = { data: "cjs" }; ',

      // `esm`
      'node_modules/esm/package.json':
        '{"name":"esm","version":"0.0.1","main":"index.js","type":"module"}',
      'node_modules/esm/index.js': 'export default { data: "esm" };',

      // `esm-2`
      'node_modules/esm-2/package.json':
        '{"name":"esm-2","version":"0.0.1","main":"index.js","type":"module"}',
      'node_modules/esm-2/index.js':
        'export const command = { commandModule: "esm" };',

      // `other`
      'node_modules/other/package.json':
        '{"name":"other","version":"0.0.1","main":"index.js"}',
      'node_modules/other/index.js': 'console.log()',
    });
  });
  afterAll(() => {
    rmSync(fixtureCwd, {
      force: true,
      recursive: true,
    });
  });
  it('Should correct load cli command plugins', async () => {
    const result = await loadCliPlugins(
      ['other', 'esm', 'esm-2', 'cjs'],
      ['@armit/cli-plugin-*/package.json', 'armit-cli-plugin-*/package.json'],
      [fixtureCwd],
      fixtureCwd
    );
    expect(result.length).toBe(3);
    expect(
      result.find((s) => !!~s.name.indexOf('@armit/cli-plugin-a'))
    ).toBeUndefined();
    expect(
      result.find((s) => !!~s.name.indexOf('armit-cli-plugin-b'))
    ).toBeUndefined();
    const esm2 = result.find((s) => !!~s.name.indexOf('esm-2'));
    expect(result.find((s) => !!~s.name.indexOf('other'))).toBeUndefined();
    expect(esm2?.name).toBe('esm-2');
    expect(esm2?.plugin).toBe('esm');
    expect(esm2).not.toBeUndefined();
    expect(result.find((s) => !!~s.name.indexOf('esm'))).not.toBeUndefined();
    expect(result.find((s) => !!~s.name.indexOf('cjs'))).not.toBeUndefined();
    expect(result.find((s) => !!~s.name.indexOf('xxxx'))).toBeUndefined();
  });
});
