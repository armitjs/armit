import { exec } from 'node:child_process';

/**
 * Check if the filepath has been commited.
 * ====
 * Note: The -s option stands for "short" and is used to display the output in a compact format.
 * - ??: Untracked files (new files that are not yet staged)
 * - A: New files that are staged and ready to be committed
 * - M: Modified files (changes made to existing files)
 * - D: Deleted files (files that have been removed from the repository)
 * - R: Renamed files
 * - C: Files with copy and rename changes
 * - U: Files with merge conflicts
 * @returns Return `true` indicates the has changed `files` waiting to be commit.
 */
export function hasChangedFilePendingToCommit() {
  return new Promise<boolean>((resolve, reject) => {
    exec(`git status -s`, (err, out) => {
      if (err) {
        return reject(err);
      }
      resolve(out.replace(/\r\n|\n|\r/g, '').length > 0);
    });
  });
}
