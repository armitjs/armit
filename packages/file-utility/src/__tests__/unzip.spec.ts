import { imageSizeFromFile } from 'image-size/fromFile';
import {
  createReadStream,
  existsSync,
  type ReadStream,
  writeFileSync,
} from 'node:fs';
import { extname, join } from 'node:path';
import { rmrfSync } from '../file-rmrf.js';
import { extractFileFromZip, unzip, zip } from '../file-zip.js';
import { getDirname } from '../get-dir-name.js';

function isCorruptedJpeg(filepath: string) {
  if (!/^\.?jpe?g$/i.test(extname(filepath))) {
    return false;
  }
  try {
    // if no error is thrown, it's not corrupted
    imageSizeFromFile(filepath);
    return false;
  } catch {
    return true;
  }
}

function streamToBuffer(stream: ReadStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => {
      chunks.push(Buffer.from(chunk as Buffer));
    });
    stream.on('error', (err) => reject(err));
    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
}

describe('unzip / unzip', () => {
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

    it('should correct unzip html, css, js, png, jpeg files via buffer', async () => {
      const zipFile = join(workCwd, 'unzip-test-asset-buffer.zip');
      const stream = createReadStream(zipFile);
      const buffer = await streamToBuffer(stream);
      unzip(buffer, unzipCwd);
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
