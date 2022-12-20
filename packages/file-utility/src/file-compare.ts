import crypto from 'node:crypto';
import { createReadStream } from 'node:fs';

/**
 * Create a new hash of given file name
 */
function computeHash(filename: string, algo: 'sha1' | 'md5'): Promise<string> {
  return new Promise<string>((resolve) => {
    const chksum = crypto.createHash(algo);
    const s = createReadStream(filename);
    s.on('error', () => {
      // no file, hash will be zero
      resolve('');
    });
    s.on('data', (d) => {
      chksum.update(d);
    });
    s.on('end', () => {
      const d = chksum.digest('hex');
      resolve(d);
    });
  });
}

/**
 * Compare two files base on their computed hash rather than just size or timestamp
 * @param file1 required string path to file 1
 * @param file2 required string path to file 2
 * @param algo option string algorithm for hash computation
 * @returns boolean indicating if compare succeeded
 */
export const fileCompare = async (
  file1: string,
  file2: string,
  algo: 'sha1' | 'md5'
): Promise<boolean> => {
  /**
   * Call the hash algorithms for each file, and send result to callback
   */
  const file2Hash = await computeHash(file2, algo);
  const file1Hash = await computeHash(file1, algo);

  return file2Hash === file1Hash;
};
