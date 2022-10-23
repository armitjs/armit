import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getPackageDir,
  getClosestPackageFile,
  findParentDir,
} from '../package-search.js';

const currDirname = dirname(fileURLToPath(import.meta.url));

describe('getPackageDir', () => {
  it('Should correct search current package dir', () => {
    const packageData = getPackageDir({
      cwd: currDirname,
    });
    expect(packageData).toBeDefined();
    expect(packageData).toBe(process.cwd());
  });
});

describe('getClosestPackageFile', () => {
  it('Should correct find package file path with cwd', () => {
    const packageFilePath = getClosestPackageFile({
      cwd: currDirname,
    });
    expect(packageFilePath).toBeDefined();
    expect(packageFilePath).toBe(join(process.cwd(), 'package.json'));
  });
  it('Should correct find package file path without cwd', () => {
    const packageFilePath = getClosestPackageFile({
      cwd: process.cwd(),
    });
    expect(packageFilePath).toBeDefined();
    expect(packageFilePath).toEqual(
      expect.stringContaining('common/package.json')
    );
    expect(packageFilePath).toBe(join(process.cwd(), 'package.json'));
  });
});

describe('findParentDir', () => {
  it('Should correct find parent dir which matched parttern', () => {
    const parentDir = findParentDir(currDirname, 'common');
    expect(parentDir).toBeDefined();
    expect(parentDir).toBe(join(process.cwd(), '../'));
  });
});
