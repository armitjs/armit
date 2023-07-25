import { exec } from 'node:child_process';

/**
 * https://git-scm.com/docs/git-diff#Documentation/git-diff.txt-emgitdiffemltoptionsgtltcommitgtltcommitgt--ltpathgt82308203
 * Viewing the changes between two arbitrary <commit>, NOTE: no `-r(remote)` argument if need to `remote` using `commitHash` of `origin/xxx`
 * If <commit> on one side is omitted, it will have the same effect as using HEAD instead.
 * @example
 * ```shell
 * git --no-pager diff --name-only 2b2ccff..50164ec
 * git --no-pager diff --name-only 2b2ccff 50164ec
 * git --no-pager diff --name-only 1381f5
 * ```
 * @param earlyCommit The diff based earlier commit hash
 * @param lastCommit If is omitted, it will have the same effect as using HEAD instead.
 * @returns Return files between two commit hash
 */

export function getDiffFiles(earlyCommit: string, lastCommit?: string) {
  const diff =
    earlyCommit && lastCommit ? `${lastCommit}..${earlyCommit}` : earlyCommit;

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
