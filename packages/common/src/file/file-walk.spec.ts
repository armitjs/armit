import { ensureFixtureFiles } from '../jest/fixture.js';
import { rmrfSync } from './file-write.js';
import { fileWalkSync } from './index.js';

describe('file-walk.mts', () => {
  let fixtureCwd;
  beforeAll(() => {
    fixtureCwd = ensureFixtureFiles(import.meta.url, 'filewalk', [
      'a/b/c/text.txt',
      'a/b/c/image.jpg',
      'a/b/c/image.png',
      'a/b/c/style.css',
    ]);
  });

  afterAll(() => {
    rmrfSync(fixtureCwd);
  });

  it('should support correct globby patterns & negative patterns', () => {
    const files = fileWalkSync('**/*.*', {
      cwd: fixtureCwd,
      ignore: ['**/*.{jpg,png}'],
    });
    expect(files.length).toBe(2);
  });
});
