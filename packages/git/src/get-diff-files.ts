import { exec } from 'node:child_process';

/**
 * https://git-scm.com/docs/git-diff#Documentation/git-diff.txt-emgitdiffemltoptionsgtltcommitgtltcommitgt--ltpathgt82308203
 * Viewing the changes between two arbitrary <commit>.
 * If <commit> on one side is omitted, it will have the same effect as using HEAD instead.
 * @example
 * ```shell
 * git --no-pager diff --name-only 2b2ccff..50164ec
 * git --no-pager diff --name-only 2b2ccff 50164ec
 * git --no-pager diff --name-only 1381f5
 * ```
 * @param basedCommitHash The diff based commit hash
 * @param newCommitHash If is omitted, it will have the same effect as using HEAD instead.
 * @returns Return files between two commit hash
 */
export function getDiffFiles(basedCommitHash: string, newCommitHash?: string) {
  const diff =
    basedCommitHash && newCommitHash
      ? `${newCommitHash}..${basedCommitHash}`
      : basedCommitHash;

  return new Promise<string[]>((resolve) => {
    exec(`git --no-pager diff --name-only ${diff}`, (err, out) => {
      if (err) {
        // fatal: ambiguous argument 'df3s053': unknown revision or path not in the working tree.
        return resolve([]);
      }
      resolve(out.split(/[\r\n]/).filter(String));
    });
  });
}
