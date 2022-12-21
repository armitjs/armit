import { exec } from 'node:child_process';

export function getLastCommitHash() {
  return new Promise<string>((resolve, reject) => {
    exec(`git log --pretty=format:'%h' -n 1`, (err, out) => {
      if (err) {
        return reject(err);
      }
      resolve(out.replace(/'/g, ''));
    });
  });
}
