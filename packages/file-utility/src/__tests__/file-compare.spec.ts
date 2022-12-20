import { join } from 'path';
import { createFixtureFiles } from '@/test-utils';
import { fileCompare, rmrfSync } from '../index.js';

describe('fileCompare', () => {
  let fixtureCwd;
  beforeAll(() => {
    fixtureCwd = createFixtureFiles(import.meta.url, 'fileCompare', {
      'file1.txt': '',
      'file2.txt': '',
    });
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
