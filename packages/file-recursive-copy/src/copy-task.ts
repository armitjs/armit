import { createReadStream, createWriteStream, utimes } from 'node:fs';
import { readlink, symlink } from 'node:fs/promises';
import type { Transform } from 'node:stream';
import type { FilesystemError } from './constants.js';
import { ensureDirectoryExists } from './ensure-directory-exists.js';
import type { CopyTaskFn } from './types.js';

export const copyDirectory: CopyTaskFn = async (srcPath, destPath) => {
  try {
    await ensureDirectoryExists(destPath);
  } catch (error) {
    const shouldIgnoreError = (error as FilesystemError).code === 'EEXIST';
    if (shouldIgnoreError) {
      return;
    }
    throw error;
  }
};

export const copySymlink: CopyTaskFn = (srcPath, destPath) => {
  return readlink(srcPath).then((link) => {
    return symlink(link, destPath);
  });
};

export const copyFile: CopyTaskFn = (srcPath, destPath, stats, options) => {
  return new Promise((resolve, reject) => {
    let hasFinished = false;
    const read = createReadStream(srcPath);
    read.on('error', handleCopyFailed);
    const write = createWriteStream(destPath, {
      flags: 'w',
      mode: stats.mode,
    });
    write.on('error', handleCopyFailed);
    write.on('finish', () => {
      utimes(destPath, stats.atime, stats.mtime, () => {
        hasFinished = true;
        resolve();
      });
    });

    let transformStream: Transform | null | undefined = null;
    if (options.transform) {
      transformStream = options.transform(srcPath, destPath, stats);
      if (transformStream) {
        transformStream.on('error', handleCopyFailed);
        read.pipe(transformStream).pipe(write);
      } else {
        read.pipe(write);
      }
    } else {
      read.pipe(write);
    }

    function handleCopyFailed(error) {
      if (hasFinished) {
        return;
      }
      hasFinished = true;
      if (typeof read.close === 'function') {
        read.close();
      }
      if (typeof write.close === 'function') {
        write.close();
      }
      return reject(error);
    }
  });
};
