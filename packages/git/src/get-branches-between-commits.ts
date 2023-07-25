import { exec } from 'node:child_process';
import { arrayUnique } from './array-unique.js';
import { getAllCommitsBetween } from './get-all-commits-between.js';
import { getCommitIdOfBranch } from './get-commit-id-of-branch.js';

const getBranchesContainCommitHash = (commit: string, remote = true) => {
  return new Promise<string[]>((resolve) => {
    // This command will list all the branch names that contain the specified commit ID and output it to the terminal
    // Note that other branch nodes checkout based on the current branch will also contain this commitId.
    exec(
      `git --no-pager branch ${remote ? '-r' : ''} --contains ${commit}`,
      (err, out) => {
        if (err) {
          // fatal: ambiguous argument 'df3s053': unknown revision or path not in the working tree.
          return resolve([]);
        }
        const branches = out
          .split(/[\r\n]/)
          .filter((branch) => {
            // Remove `* (HEAD detached at b121521)`
            return !~branch.toUpperCase().indexOf('(HEAD') && !!branch.trim();
          })
          .map((s) => s.trim());

        resolve(branches);
      }
    );
  });
};

/**
 * This will list all branches that contain any of the commits between commit1 and commit2
 * @param lastCommit if not will look up to first commit `HEAD`
 * @param earlyCommit The earlier commit `master`
 * @param remote The remote-tracking
 * @returns All commits
 */
export const getBranchesBetweenCommits = async (
  lastCommit: string,
  earlyCommit: string,
  remote = true
) => {
  const allBranches: string[] = [];
  const allCommits = await getAllCommitsBetween(
    lastCommit,
    earlyCommit,
    remote
  );

  for (const commit of allCommits) {
    // Note: it may contains `branches` that checkout based on current `commit hash` but out of the `commit` range we want.
    const branches = await getBranchesContainCommitHash(commit, remote);
    allBranches.push(...branches);
  }

  const finalBranches: string[] = [];
  // re-loop all branches to check it's commit hash between `${allCommits}`
  for (const branch of allBranches) {
    const branchCommitHash = await getCommitIdOfBranch(branch, true);
    if (branchCommitHash && allCommits.includes(branchCommitHash)) {
      finalBranches.push(branch);
    }
  }

  return arrayUnique(finalBranches);
};
