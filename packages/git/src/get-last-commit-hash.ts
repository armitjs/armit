import { exec } from 'node:child_process';

export function getLastCommitHash() {
  return new Promise<string | null>((resolve) => {
    exec(`git log --pretty=format:'%h' -n 1`, (err, out) => {
      if (err) {
        return resolve(null);
      }
      resolve(out.replace(/'/g, ''));
    });
  });
}
