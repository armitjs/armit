import { exec } from 'node:child_process';

/**
 * https://stackoverflow.com/questions/15677439/command-to-get-latest-git-commit-hash-from-a-branch
 * Finding out the latest commit hash locally,
 * @param branchName  e.g. `main`, `workspace`,....
 * @returns The branch commit hash.
 */
export const getCommitIdOfBranch = (branchName = 'HEAD') => {
  return new Promise<string | null>((resolve) => {
    exec(`git rev-parse ${branchName}`, (err, out) => {
      if (err) {
        return resolve(null);
      }
      resolve(out.replace(/\r\n|\n|\r/g, ''));
    });
  });
};
