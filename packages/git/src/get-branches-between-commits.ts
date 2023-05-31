import { exec } from 'node:child_process';
import { arrayUnique } from './array-unique.js';
import { getAllCommitsBetween } from './get-all-commits-between.js';

const getBranchesContainCommitHash = (commit: string) => {
  return new Promise<string[]>((resolve) => {
    exec(`git --no-pager branch --contains ${commit}`, (err, out) => {
      if (err) {
        // fatal: ambiguous argument 'df3s053': unknown revision or path not in the working tree.
        return resolve([]);
      }
      const branches = out
        .split(/[\r\n]/)
        .filter((branch) => {
          // Remove `* (HEAD detached at b121521)`
          return !~branch.toUpperCase().indexOf('(HEAD');
        })
        .map((s) => s.trim());

      resolve(branches);
    });
  });
};

/**
 * This will list all branches that contain any of the commits between commit1 and commit2
 * @param lastCommit if not will look up to first commit `HEAD`
 * @param earlyCommit The earlier commit `master`
 * @returns All commits
 */
export const getBranchesBetweenCommits = async (
  lastCommit: string,
  earlyCommit: string
) => {
  const allBranches: string[] = [];
  const allCommits = await getAllCommitsBetween(lastCommit, earlyCommit);
  for (const commit of allCommits) {
    const branches = await getBranchesContainCommitHash(commit);
    allBranches.push(...branches);
  }
  return arrayUnique(allBranches);
};
