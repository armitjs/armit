import { exec } from 'node:child_process';

export function gitBranchName() {
  return new Promise<string>((resolve, reject) => {
    exec(`git branch | sed -n '/\\* /s///p'`, (err, out) => {
      if (err) {
        return reject(err);
      }
      resolve(out.replace(/\r\n|\n|\r/g, ''));
    });
  });
}
