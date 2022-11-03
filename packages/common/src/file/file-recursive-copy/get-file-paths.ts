import { lstat, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

export async function getFilePaths(
  src: string,
  shouldExpandSymlinks: boolean
): Promise<string[]> {
  const stats = await (shouldExpandSymlinks ? stat : lstat)(src);
  if (stats.isDirectory()) {
    const filenames = await getFileListing(src, shouldExpandSymlinks);
    return [src].concat(filenames);
  } else {
    return [src];
  }
}

async function getFileListing(
  srcPath: string,
  shouldExpandSymlinks: boolean
): Promise<string[]> {
  // read all directory names
  const fileNames = await readdir(srcPath);
  const result: string[] = [];
  for (const filename of fileNames) {
    const filePath = join(srcPath, filename);
    const stats = await (shouldExpandSymlinks ? stat : lstat)(filePath);
    if (stats.isDirectory()) {
      const childPaths = await getFileListing(filePath, shouldExpandSymlinks);
      result.push(...childPaths);
    } else {
      result.push(filePath);
    }
  }
  return result;
}
