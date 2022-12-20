import { statSync } from 'node:fs';
/**
 * Sync Returns true if a filepath exists on the file system and it's directory.
 * @param path The given path
 * @throws Error('expected path to be a string') if `path !== 'string'`
 */
export const isDirectory = (path: string): boolean => {
  if (typeof path !== 'string') {
    throw new Error('expected path to be a string');
  }
  try {
    const stat = statSync(path);
    return stat.isDirectory();
  } catch (err) {
    if ((err as { code?: string | undefined })?.code === 'ENOENT') {
      return false;
    } else {
      throw err;
    }
  }
};
