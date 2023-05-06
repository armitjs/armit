import { type Stats, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

function tryStatSync(file: string): Stats | undefined {
  try {
    return statSync(file, { throwIfNoEntry: false });
  } catch {
    // Ignore errors
  }
}

function lookupFile(dir: string, fileNames: string[]): string | undefined {
  while (dir) {
    for (const fileName of fileNames) {
      const fullPath = join(dir, fileName);
      if (tryStatSync(fullPath)?.isFile()) return fullPath;
    }
    const parentDir = dirname(dir);
    if (parentDir === dir) return;

    dir = parentDir;
  }
}

export const isEsmMode = (resolvedPath: string) => {
  let isESM = false;
  if (/\.m[jt]s$/.test(resolvedPath)) {
    isESM = true;
  } else if (/\.c[jt]s$/.test(resolvedPath)) {
    isESM = false;
  } else {
    const configRoot = dirname(resolvedPath);
    // check package.json for type: "module" and set `isESM` to true
    const pkg = lookupFile(configRoot, ['package.json']);
    isESM = !!pkg && JSON.parse(readFileSync(pkg, 'utf-8')).type === 'module';
  }
  return isESM;
};
