import { exec } from 'node:child_process';

/**
 * Check if the filepath has been commited.
 * @param fileName The file name
 * @returns Return true indicates the files has been commited.
 */
export function getFileCommitStatus(fileName) {
  return new Promise<boolean>((resolve, reject) => {
    exec(`git ls-files ${fileName}`, (err, out) => {
      if (err) {
        return reject(err);
      }
      resolve(out.replace(/\r\n|\n|\r/g, '').length > 0);
    });
  });
}
