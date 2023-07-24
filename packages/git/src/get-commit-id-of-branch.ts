import { exec } from 'node:child_process';

/**
 * https://stackoverflow.com/questions/15677439/command-to-get-latest-git-commit-hash-from-a-branch
 * Finding out the latest commit hash locally,
 * @param branchName  e.g. `main`, `workspace`,....
 * @param short `ba39827` instead `ba3982746fafc8b1c37fce7692cb28b01044bb5f`
 * @param remote true
 * @returns The branch commit hash.
 */
export const getCommitIdOfBranch = (
  branchName = 'HEAD',
  short = true,
  remote = true
) => {
  return new Promise<string | null>((resolve) => {
    exec(
      `git rev-parse  ${remote ? '-r' : ''} ${
        short ? '--short ' : ''
      }${branchName}`,
      (err, out) => {
        if (err) {
          return resolve(null);
        }
        resolve(out.replace(/\r\n|\n|\r/g, ''));
      }
    );
  });
};
