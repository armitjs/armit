import { existsSync, mkdirSync } from 'fs';
import { ensureFixtureFiles } from '../jest/fixture.js';
import { rmrfSync } from './file-write.js';
import { mergeDirs } from './merge-dirs.js';

describe('merge-dirs.mts', () => {
  let fixtureCwd;
  beforeAll(() => {
    fixtureCwd = ensureFixtureFiles(import.meta.url, 'mergedirs', [
      'a/hello.txt',
      'b/hello.txt',
      'b/world.txt',
    ]);
  });

  afterAll(() => {
    rmrfSync(fixtureCwd);
  });

  it('should merge 2 folders', () => {
    mkdirSync(fixtureCwd + '/c');
    mergeDirs(fixtureCwd + '/a', fixtureCwd + '/c');
    mergeDirs(fixtureCwd + '/b', fixtureCwd + '/c');
    expect(existsSync(fixtureCwd + '/c/hello.txt')).toBe(true);
    expect(existsSync(fixtureCwd + '/c/world.txt')).toBe(true);
  });
});
