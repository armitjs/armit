/* eslint-disable vitest/expect-expect */
/* eslint-disable vitest/no-identical-title */
import { readlinkSync, rmSync, statSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  getDirname,
  normalizeSlash,
  rmrfSyncByPattern,
} from '@armit/file-utility';
import { ensureDirectoryExists } from '../ensure-directory-exists.js';
import { recursiveCopy } from '../file-recursive-copy.js';
import {
  checkResults,
  createSymbolicLink,
  getDestinationPath,
  getOutputFiles,
  getSourcePath,
} from './copy-utils.js';

describe('recursive copy basic operation', () => {
  const testCwd = getDirname(import.meta.url);
  const SOURCE_PATH = resolve(testCwd, './fixtures/source');
  const DESTINATION_PATH = resolve(testCwd, './fixtures/destination-basic');

  beforeEach(async () => {
    await ensureDirectoryExists(DESTINATION_PATH);
    rmrfSyncByPattern(`${DESTINATION_PATH}/**/*`);
  });

  afterEach(() => {
    rmSync(DESTINATION_PATH, {
      recursive: true,
      force: true,
    });
  });

  it('should copy single files', async () => {
    try {
      await recursiveCopy(
        getSourcePath('file', SOURCE_PATH),
        getDestinationPath('file', DESTINATION_PATH)
      );
    } catch (err) {
      console.log(err);
    }
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      file: 'Hello, world!\n',
    });
  });

  it('should return results for single files', async () => {
    expect(1).toBe(1);
    const results = await recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH)
    );
    checkResults(
      results || [],
      {
        file: 'file',
      },
      SOURCE_PATH,
      DESTINATION_PATH
    );
  });

  it('should retain file modification dates', async () => {
    await new Promise(function (resolve) {
      setTimeout(resolve, 1000);
    });

    await recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH)
    );

    const actual = statSync(getDestinationPath('file', DESTINATION_PATH)).mtime;
    const expected = statSync(getSourcePath('file', SOURCE_PATH)).mtime;
    actual.setMilliseconds(0);
    expected.setMilliseconds(0);
    expect(actual).toEqual(expected);
  });

  it('should retain file permissions', async () => {
    await recursiveCopy(
      getSourcePath('executable', SOURCE_PATH),
      getDestinationPath('executable', DESTINATION_PATH)
    );
    const actual = statSync(
      getDestinationPath('executable', DESTINATION_PATH)
    ).mode;
    const expected = statSync(getSourcePath('executable', SOURCE_PATH)).mode;
    expect(actual).toEqual(expected);
  });

  it('should create parent directory if it does not exist', async () => {
    expect(1).toBe(1);

    const results = await recursiveCopy(
      getSourcePath('nested-file/file', SOURCE_PATH),
      getDestinationPath('nested-file/file', DESTINATION_PATH)
    );
    checkResults(
      results || [],
      {
        'nested-file/file': 'file',
      },
      SOURCE_PATH,
      DESTINATION_PATH
    );
  });

  it('should copy empty directories', async () => {
    await recursiveCopy(
      getSourcePath('empty', SOURCE_PATH),
      getDestinationPath('empty', DESTINATION_PATH)
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      empty: {},
    });
  });

  it('should return results for empty directories', async () => {
    expect(1).toBe(1);

    const results = await recursiveCopy(
      getSourcePath('empty', SOURCE_PATH),
      getDestinationPath('empty', DESTINATION_PATH)
    );
    checkResults(
      results || [],
      {
        empty: 'dir',
      },
      SOURCE_PATH,
      DESTINATION_PATH
    );
  });

  it('should copy directories', async () => {
    await recursiveCopy(
      getSourcePath('directory', SOURCE_PATH),
      getDestinationPath('directory', DESTINATION_PATH)
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      directory: {
        a: 'a\n',
        b: 'b\n',
        c: 'c\n',
      },
    });
  });

  it('should return results for directories', async () => {
    expect(1).toBe(1);

    const results = await recursiveCopy(
      getSourcePath('directory', SOURCE_PATH),
      getDestinationPath('directory', DESTINATION_PATH)
    );
    checkResults(
      results || [],
      {
        directory: 'dir',
        'directory/a': 'file',
        'directory/b': 'file',
        'directory/c': 'file',
      },
      SOURCE_PATH,
      DESTINATION_PATH
    );
  });

  it('should copy nested directories', async () => {
    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('nested-directory', DESTINATION_PATH)
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      'nested-directory': {
        '1': {
          '1-1': {
            '1-1-a': '1-1-a\n',
            '1-1-b': '1-1-b\n',
          },
          '1-2': {
            '1-2-a': '1-2-a\n',
            '1-2-b': '1-2-b\n',
          },
          '1-a': '1-a\n',
          '1-b': '1-b\n',
        },
        '2': {
          '2-1': {
            '2-1-a': '2-1-a\n',
            '2-1-b': '2-1-b\n',
          },
          '2-2': {
            '2-2-a': '2-2-a\n',
            '2-2-b': '2-2-b\n',
          },
          '2-a': '2-a\n',
          '2-b': '2-b\n',
        },
        a: 'a\n',
        b: 'b\n',
      },
    });
  });

  it('should return results for directories', async () => {
    const results = await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('nested-directory', DESTINATION_PATH)
    );
    checkResults(
      results || [],
      {
        'nested-directory': 'dir',
        'nested-directory/1': 'dir',
        'nested-directory/1/1-1': 'dir',
        'nested-directory/1/1-1/1-1-a': 'file',
        'nested-directory/1/1-1/1-1-b': 'file',
        'nested-directory/1/1-2': 'dir',
        'nested-directory/1/1-2/1-2-a': 'file',
        'nested-directory/1/1-2/1-2-b': 'file',
        'nested-directory/1/1-a': 'file',
        'nested-directory/1/1-b': 'file',
        'nested-directory/2': 'dir',
        'nested-directory/2/2-1': 'dir',
        'nested-directory/2/2-1/2-1-a': 'file',
        'nested-directory/2/2-1/2-1-b': 'file',
        'nested-directory/2/2-2': 'dir',
        'nested-directory/2/2-2/2-2-a': 'file',
        'nested-directory/2/2-2/2-2-b': 'file',
        'nested-directory/2/2-a': 'file',
        'nested-directory/2/2-b': 'file',
        'nested-directory/a': 'file',
        'nested-directory/b': 'file',
      },
      SOURCE_PATH,
      DESTINATION_PATH
    );
  });

  it('should merge directories into existing directories', async () => {
    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH)
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    const expected = {
      '1': {
        '1-1': {
          '1-1-a': '1-1-a\n',
          '1-1-b': '1-1-b\n',
        },
        '1-2': {
          '1-2-a': '1-2-a\n',
          '1-2-b': '1-2-b\n',
        },
        '1-a': '1-a\n',
        '1-b': '1-b\n',
      },
      '2': {
        '2-1': {
          '2-1-a': '2-1-a\n',
          '2-1-b': '2-1-b\n',
        },
        '2-2': {
          '2-2-a': '2-2-a\n',
          '2-2-b': '2-2-b\n',
        },
        '2-a': '2-a\n',
        '2-b': '2-b\n',
      },
      a: 'a\n',
      b: 'b\n',
    };
    expect(files).toEqual(expected);
  });

  it('should copy symlinks', async () => {
    createSymbolicLink('.', getSourcePath('symlink', SOURCE_PATH), 'dir');
    await recursiveCopy(
      getSourcePath('symlink', SOURCE_PATH),
      getDestinationPath('symlink', DESTINATION_PATH)
    );
    const actual = readlinkSync(
      getDestinationPath('symlink', DESTINATION_PATH)
    );
    expect(actual).toEqual('.');
    unlinkSync(getSourcePath('symlink', SOURCE_PATH));
  });

  it('should return results for symlinks', async () => {
    createSymbolicLink('.', getSourcePath('symlink', SOURCE_PATH), 'dir');
    const results = await recursiveCopy(
      getSourcePath('symlink', SOURCE_PATH),
      getDestinationPath('symlink', DESTINATION_PATH)
    );
    checkResults(
      results || [],
      {
        symlink: 'symlink',
      },
      SOURCE_PATH,
      DESTINATION_PATH
    );
    unlinkSync(getSourcePath('symlink', SOURCE_PATH));
  });

  it('should copy nested symlinks', async () => {
    createSymbolicLink(
      '../file',
      getSourcePath('nested-symlinks/file', SOURCE_PATH),
      'file'
    );
    createSymbolicLink(
      '../directory',
      getSourcePath('nested-symlinks/directory', SOURCE_PATH),
      'dir'
    );
    createSymbolicLink(
      '../../directory',
      getSourcePath('nested-symlinks/nested/directory', SOURCE_PATH),
      'dir'
    );
    await recursiveCopy(
      getSourcePath('nested-symlinks', SOURCE_PATH),
      getDestinationPath('nested-symlinks', DESTINATION_PATH)
    );
    let actual, expected;
    actual = normalizeSlash(
      readlinkSync(getDestinationPath('nested-symlinks/file', DESTINATION_PATH))
    );
    expected = '../file';
    expect(actual).toEqual(expected);
    actual = normalizeSlash(
      readlinkSync(
        getDestinationPath('nested-symlinks/directory', DESTINATION_PATH)
      )
    );
    expected = '../directory';
    expect(actual).toEqual(expected);
    actual = normalizeSlash(
      readlinkSync(
        getDestinationPath('nested-symlinks/nested/directory', DESTINATION_PATH)
      )
    );
    expected = '../../directory';
    expect(actual).toEqual(expected);
  });

  it('should return results for nested symlinks', async () => {
    createSymbolicLink(
      '../file',
      getSourcePath('nested-symlinks/file', SOURCE_PATH),
      'file'
    );
    createSymbolicLink(
      '../directory',
      getSourcePath('nested-symlinks/directory', SOURCE_PATH),
      'dir'
    );
    createSymbolicLink(
      '../../directory',
      getSourcePath('nested-symlinks/nested/directory', SOURCE_PATH),
      'dir'
    );
    const results = await recursiveCopy(
      getSourcePath('nested-symlinks', SOURCE_PATH),
      getDestinationPath('nested-symlinks', DESTINATION_PATH)
    );
    checkResults(
      results || [],
      {
        'nested-symlinks': 'dir',
        'nested-symlinks/file': 'symlink',
        'nested-symlinks/directory': 'symlink',
        'nested-symlinks/nested': 'dir',
        'nested-symlinks/nested/directory': 'symlink',
      },
      SOURCE_PATH,
      DESTINATION_PATH
    );
  });
});
