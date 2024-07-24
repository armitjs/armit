import { globSync } from 'glob';
import { lstatSync } from 'node:fs';
import path from 'path';

const PACKAGES_GLOB = '{@*/*,[^@]*}/';
const NODE_MODULES = 'node_modules';

/**
 * Returns a list of the listed packages in the directory
 * @param {String} [cwd] Node modules directory - Defaults to process directory
 */
export function getNpmLinked(cwd = path.join(process.cwd(), NODE_MODULES)) {
  return globSync(PACKAGES_GLOB, { cwd }).filter((file) => {
    const stat = lstatSync(path.join(cwd, file));
    return stat.isSymbolicLink();
  });
}
