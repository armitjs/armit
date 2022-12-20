import { mkdir } from 'node:fs/promises';

export const ensureDirectoryExists = async (path: string) => {
  await mkdir(path, {
    recursive: true,
  });
};
