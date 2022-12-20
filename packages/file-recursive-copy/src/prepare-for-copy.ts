import type { Stats } from 'node:fs';
import { lstat, stat } from 'node:fs/promises';
import { rmrfSync } from '@armit/file-utility';
import { fsError } from './constants.js';
import type { RecursiveCopyOptions } from './types.js';

export async function prepareForCopy(
  srcPath: string,
  destPath: string,
  options: RecursiveCopyOptions
): Promise<Stats> {
  const shouldExpandSymlinks = Boolean(options.expand);
  const shouldOverwriteExistingFiles = Boolean(options.overwrite);
  const stats = await (shouldExpandSymlinks ? stat : lstat)(srcPath);
  await ensureDestinationIsWritable(
    destPath,
    stats,
    shouldOverwriteExistingFiles
  );
  return stats;
}

async function ensureDestinationIsWritable(
  destPath: string,
  srcStats: Stats,
  shouldOverwriteExistingFiles: boolean
): Promise<boolean> {
  try {
    const destStats = await lstat(destPath);
    const destExists = Boolean(destStats);

    if (!destExists) {
      return true;
    }

    const isMergePossible = srcStats.isDirectory() && destStats.isDirectory();
    if (isMergePossible) {
      return true;
    }

    if (shouldOverwriteExistingFiles) {
      rmrfSync(destPath);
      return true;
    } else {
      throw fsError('EEXIST', destPath);
    }
  } catch (error) {
    const shouldIgnoreError = (error as { code: string }).code === 'ENOENT';
    if (shouldIgnoreError) {
      return true;
    }
    throw error;
  }
}
