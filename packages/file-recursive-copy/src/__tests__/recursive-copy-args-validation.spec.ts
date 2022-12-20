import { rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getDirname, rmrfSyncByPattern } from '@armit/file-utility';
import { ensureDirectoryExists } from '../ensure-directory-exists.js';
import { recursiveCopy } from '../file-recursive-copy.js';
import {
  getDestinationPath,
  getOutputFiles,
  getSourcePath,
} from './copy-utils.js';

describe('recursive copy argument validation', () => {
  const testCwd = getDirname(import.meta.url);
  const SOURCE_PATH = resolve(testCwd, './fixtures/source');
  const DESTINATION_PATH = resolve(
    testCwd,
    './fixtures/destination-validation'
  );

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

  it('should throw an error if the source path does not exist', async () => {
    const actual = recursiveCopy(
      'nonexistent',
      getDestinationPath('', DESTINATION_PATH)
    );
    return expect(actual).rejects.toThrow('ENOENT');
  });

  it('should throw an error if the destination path exists (single file)', async () => {
    writeFileSync(getDestinationPath('file', DESTINATION_PATH), '');

    const actual = recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH)
    );
    return expect(actual).rejects.toThrow('EEXIST');
  });

  it('should not throw an error if an nonconflicting file exists within the destination path (single file)', async () => {
    writeFileSync(getDestinationPath('pre-existing', DESTINATION_PATH), '');

    await recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH)
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      'pre-existing': '',
      file: 'Hello, world!\n',
    });
  });

  it('should throw an error if a conflicting file exists within the destination path (directory)', async () => {
    writeFileSync(getDestinationPath('a', DESTINATION_PATH), '');

    const actual = recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH)
    );
    return expect(actual).rejects.toThrow('EEXIST');
  });

  it('should not throw an error if an nonconflicting file exists within the destination path (directory)', async () => {
    writeFileSync(getDestinationPath('pre-existing', DESTINATION_PATH), '');

    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH),
      {
        overwrite: true,
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      'pre-existing': '',
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
    });
  });
});
