import { existsSync, mkdirSync } from 'fs';
import { createFixtureFiles } from '../../test-utils/fixture.js';
import { rmrfSync } from '../file-write.js';
import { mergeDirs } from '../merge-dirs.js';

describe('mergeDirs', () => {
  let fixtureCwd;
  beforeAll(() => {
    fixtureCwd = createFixtureFiles(import.meta.url, 'mergedirs', {
      'a/hello.txt': '',
      'b/hello.txt': '',
      'b/world.txt': '',
    });
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
