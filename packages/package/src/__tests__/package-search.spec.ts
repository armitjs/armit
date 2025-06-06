import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  searchClosestPackageFile,
  searchPackageDir,
  searchParentDir,
} from '../package-search.js';

const currDirname = dirname(fileURLToPath(import.meta.url));

describe('searchPackageDir', () => {
  it('Should correct search current package dir', () => {
    const packageData = searchPackageDir({
      cwd: currDirname,
    });
    expect(packageData).toBeDefined();
    expect(packageData).toBe(process.cwd());
  });

  it('Should correct search current package dir with esm exports', () => {
    const packageRoot = searchPackageDir({
      cwd: join(currDirname, 'fixtures/esm-exports/dist'),
    });
    expect(packageRoot).toBeDefined();
    expect(packageRoot).toBe(join(currDirname, 'fixtures/esm-exports'));
  });

  it('Should correct search mono root package dir with tsconfig', () => {
    const monoRoot = join(currDirname, '../../../../node_modules/vite');
    const packageRoot = searchPackageDir({
      cwd: join(monoRoot, 'dist'),
    });
    expect(packageRoot).toBeDefined();
    expect(packageRoot).toBe(monoRoot);
  });
});

describe('searchClosestPackageFile', () => {
  it('Should correct find package file path with cwd', () => {
    const packageFilePath = searchClosestPackageFile({
      cwd: currDirname,
    });
    expect(packageFilePath).toBeDefined();
    expect(packageFilePath).toBe(join(process.cwd(), 'package.json'));
  });
  it('Should correct find package file path without cwd', () => {
    const packageFilePath = searchClosestPackageFile({
      cwd: process.cwd(),
    });
    expect(packageFilePath).toBeDefined();
    expect(packageFilePath).toEqual(
      expect.stringContaining('package/package.json')
    );
    expect(packageFilePath).toBe(join(process.cwd(), 'package.json'));
  });
});

describe('searchParentDir', () => {
  it('Should correct find parent dir which matched parttern', () => {
    const parentDir = searchParentDir(currDirname, 'package');
    expect(parentDir).toBeDefined();
    expect(parentDir).toBe(join(process.cwd(), '../'));
    const parentDirNull = searchParentDir(currDirname, 'null');
    expect(parentDirNull).toBe(null);
  });
});
