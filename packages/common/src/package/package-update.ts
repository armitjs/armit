import type { PackageJson } from 'type-fest';
import updateNotifier from 'update-notifier';

/**
 * Inform users of your package of updates in a non-intrusive way.
 * Checks for available update of the current CLI
 * @param pkg the cli package json.
 */
export function updateCheck(pkg?: PackageJson): void {
  if (pkg) {
    const notifier = updateNotifier({ pkg });
    notifier.notify();
  }
}
