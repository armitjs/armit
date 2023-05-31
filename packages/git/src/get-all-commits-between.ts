import { exec } from 'node:child_process';

/**
 * This will list all commits that contain any of the commits between earlyCommit and lastCommit
 * @param lastCommit The lasted commit `HEAD`
 * @param earlyCommit The early commit `master`
 * @returns All commits
 */
export const getAllCommitsBetween = (
  lastCommit: string,
  earlyCommit: string
) => {
  // NOTE: The order is from `${earlyCommit} to ${lastComit}`
  const diff =
    earlyCommit && lastCommit ? `${earlyCommit}..${lastCommit}` : lastCommit;

  // if only `lastCommit` provider, will list all commits.
  return new Promise<string[]>((resolve) => {
    exec(
      `git --no-pager log --oneline ${diff} | cut -d " " -f1`,
      (err, out) => {
        if (err) {
          // fatal: ambiguous argument 'df3s053': unknown revision or path not in the working tree.
          return resolve([]);
        }
        resolve(out.split(/[\r\n|]/).filter(String));
      }
    );
  });
};
