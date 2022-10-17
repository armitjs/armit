import { existsSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { jest } from '@jest/globals';
import { imageSize } from 'image-size';
import { getDirname } from '../dir-name.js';
import { rmrfSync } from '../file-write.js';
import { extractFileFromZip, unzip, zip } from '../zip.js';

function isCorruptedJpeg(filepath) {
  if (!/^\.?jpe?g$/i.test(extname(filepath))) {
    return false;
  }
  try {
    // if no error is thrown, it's not corrupted
    imageSize(filepath);
    return false;
  } catch (err) {
    return true;
  }
}

describe('unzip / unzip', () => {
  jest.setTimeout(5000000);
  const workCwd = getDirname(import.meta.url);
  const unzipCwd = join(workCwd, 'unzip');
  afterAll(() => {
    rmrfSync(unzipCwd);
    rmrfSync(join(workCwd, 'new-zip-test-asset.zip'));
  });

  describe('unzip', () => {
    it('should correct unzip html, css, js, png, jpeg files', () => {
      unzip(join(workCwd, 'unzip-test-asset.zip'), unzipCwd);
      const imagePath = join(unzipCwd, 'test/assets/demo-8ca86e6b.jpg');
      expect(existsSync(imagePath)).toBe(true);
      const corrupted = isCorruptedJpeg(imagePath);
      expect(corrupted).toBe(false);
    });
  });

  describe('zip', () => {
    it('should correct zip html, css, js, png, jpeg files', async () => {
      // make sure we have unzip before new zip.
      unzip(join(workCwd, 'unzip-test-asset.zip'), unzipCwd);
      const newZip = join(workCwd, 'new-zip-test-asset.zip');

      await zip(unzipCwd, newZip, {
        relativePathTo: unzipCwd,
      });

      expect(existsSync(newZip)).toBe(true);

      const jpegData = extractFileFromZip(
        newZip,
        'test/assets/demo-8ca86e6b.jpg'
      );

      expect(jpegData).not.toBeNull();

      if (jpegData) {
        writeFileSync(join(unzipCwd, 'test-new-zip-jpeg.jpg'), jpegData);
        expect(isCorruptedJpeg(join(unzipCwd, 'test-new-zip-jpeg.jpg'))).toBe(
          false
        );
      }
    });
  });
});
