import {
  createFixtureFiles,
  rmrfSync,
  fileWalkSync,
  fileWalk,
} from '@armit/common';

describe('fileWalk', () => {
  let fixtureCwd;
  beforeAll(() => {
    fixtureCwd = createFixtureFiles(import.meta.url, 'filewalk', [
      'a/b/c/text.txt',
      'a/b/c/image.jpg',
      'a/b/c/image.png',
      'a/b/c/style.css',
    ]);
  });

  afterAll(() => {
    rmrfSync(fixtureCwd);
  });

  describe('fileWalkSync', () => {
    it('should synchronously support correct globby patterns & negative patterns', () => {
      const files = fileWalkSync('**/*.*', {
        cwd: fixtureCwd,
        ignore: ['**/*.{jpg,png}'],
      });
      expect(files.length).toBe(2);
    });
  });

  describe('fileWalkAsync', () => {
    it('should asynchronously support correct globby patterns & negative patterns', async () => {
      const files = await fileWalk('**/*.*', {
        cwd: fixtureCwd,
        ignore: ['**/*.{jpg,png}'],
      });
      expect(files.length).toBe(2);
    });
  });
});
