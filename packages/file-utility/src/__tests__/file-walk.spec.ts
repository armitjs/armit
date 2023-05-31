import { createFixtureFiles } from '@/test-utils';
import { rmrfSync, fileWalkSync, fileWalk } from '../index.js';

describe('fileWalk', () => {
  let fixtureCwd;
  beforeAll(() => {
    fixtureCwd = createFixtureFiles(import.meta.url, 'filewalk', {
      'a/b/c/text.txt': '',
      'a/b/c/image.jpg': '',
      'a/b/c/image.png': '',
      'a/b/c/d/e/image.jpg': '',
      'a/b/c/d/e/image.png': '',
      'a/b/c/style.css': '',
      'a/b/c/.gitignore': '',
      '__MACOSX/test/._demo-8ca86e6b.png': '',
      '__MACOSX/test/demo-8ca86e6b.png': '',
      '__MACOSX/test/assets/__MACOSX/test/._.DS_Store': '',
      'abc/__MACOSX/test/._demo-8ca86e6b.png': '',
      'abc/__MACOSX/test/demo-8ca86e6b.png': '',
      'abc/__MACOSX/test/assets/__MACOSX/test/._.DS_Store': '',
    });
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
      expect(files.length).toBe(3);
      expect(files.filter((s) => s.endsWith('.gitignore')).length).toBe(1);

      const files2 = fileWalkSync('**/b/c/**/*.{jpg,png}', {
        cwd: fixtureCwd,
      });
      expect(files2.length).toBe(4);

      const files3 = fileWalkSync('**/a/b/c/**/*.{jpg,png}', {
        cwd: fixtureCwd,
      });
      expect(files3.length).toBe(4);
    });

    it('should synchronously currect handle dot files', () => {
      const files = fileWalkSync('**/*.*', {
        cwd: fixtureCwd,
      });
      expect(files.length).toBe(7);
      expect(files.filter((s) => s.endsWith('.gitignore')).length).toBe(1);
    });

    it('should asynchronously ignore __MACOSX & .DS_Store', () => {
      const files = fileWalkSync('**/*.*', {
        cwd: fixtureCwd,
      });
      expect(files.length).toBe(7);
      expect(files.filter((s) => s.endsWith('.gitignore')).length).toBe(1);
    });
  });

  describe('fileWalkAsync', () => {
    it('should asynchronously support correct globby patterns & negative patterns', async () => {
      const files = await fileWalk('**/*.*', {
        cwd: fixtureCwd,
        ignore: ['**/*.{jpg,png}'],
      });
      expect(files.length).toBe(3);
      expect(files.filter((s) => s.endsWith('.gitignore')).length).toBe(1);
    });

    it('should asynchronously currect handle dot files', async () => {
      const files = await fileWalk('**/*.*', {
        cwd: fixtureCwd,
      });
      expect(files.length).toBe(7);
      expect(files.filter((s) => s.endsWith('.gitignore')).length).toBe(1);
    });

    it('should asynchronously ignore __MACOSX & .DS_Store', async () => {
      const files = await fileWalk('**/*.*', {
        cwd: fixtureCwd,
      });
      expect(files.length).toBe(7);
      expect(files.filter((s) => s.endsWith('.gitignore')).length).toBe(1);
    });
  });
});
