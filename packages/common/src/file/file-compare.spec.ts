import { join } from 'path';
import { ensureFixtureFiles } from '../jest/fixture.js';
import { fileCompare } from './file-compare.js';
import { rmrfSync } from './file-write.js';

describe('file-compare.mts', () => {
  let fixtureCwd;
  beforeAll(() => {
    fixtureCwd = ensureFixtureFiles(import.meta.url, 'fileCompare', [
      'file1.txt',
      'file2.txt',
    ]);
  });

  afterAll(() => {
    rmrfSync(fixtureCwd);
  });

  it('should return true for same files', async () => {
    const same = await fileCompare(
      join(fixtureCwd, 'file1.txt'),
      join(fixtureCwd, 'file1.txt'),
      'md5'
    );
    expect(same).toBe(true);
  });

  it('should return false for differ files', async () => {
    const notSame = await fileCompare(
      join(fixtureCwd, 'file1.txt'),
      join(fixtureCwd, 'file2.txt'),
      'md5'
    );
    expect(notSame).toBe(false);
  });
});
