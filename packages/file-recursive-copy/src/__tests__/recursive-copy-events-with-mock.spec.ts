import { rmSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { getDirname, rmrfSyncByPattern } from '@armit/file-utility';
import { copyDirectory, copySymlink } from '../copy-task.js';
import { ensureDirectoryExists } from '../ensure-directory-exists.js';
import { recursiveCopy } from '../file-recursive-copy.js';
import {
  createSymbolicLink,
  getDestinationPath,
  getSourcePath,
  listenTo,
} from './copy-utils.js';

vi.mock('../copy-task.js', () => {
  return {
    copyDirectory: vi.fn(),
    copySymlink: vi.fn(),
  };
});

describe('recursive copy events with mock', () => {
  const testCwd = getDirname(import.meta.url);
  const SOURCE_PATH = resolve(testCwd, './fixtures/source');
  const DESTINATION_PATH = resolve(
    testCwd,
    './fixtures/destination-events-with-mock'
  );
  const COPY_EVENTS = Object.keys(recursiveCopy.events).map((key) => {
    return recursiveCopy.events[key];
  });
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

  afterAll(() => {
    vi.resetAllMocks();
  });

  it('should emit directory copy error events', async () => {
    const errors = {};
    errors[getDestinationPath('empty', DESTINATION_PATH)] = new Error(
      'Test error'
    );
    vi.mocked(copyDirectory).mockImplementationOnce((_srcPath, destPath) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (errors && errors[destPath as string]) {
            reject(errors[destPath as string]);
          } else {
            resolve(undefined);
          }
        });
      });
    });

    try {
      const copier = recursiveCopy(
        getSourcePath('empty', SOURCE_PATH),
        getDestinationPath('empty', DESTINATION_PATH)
      );
      const events = listenTo(copier, COPY_EVENTS);
      await expect(copier).rejects.toThrow('Test error');

      expect(events.map((event) => event.name)).toEqual([
        'createDirectoryStart',
        'createDirectoryError',
        'error',
      ]);

      const errorEvent = events.filter((event) => {
        return event.name === 'error';
      })[0];
      expect(errorEvent.args).toHaveLength(2);

      const error = errorEvent.args[0];
      const copyOperation = errorEvent.args[1];

      expect(error.message).toEqual('Test error');
      expect(copyOperation.src).toEqual(getSourcePath('empty', SOURCE_PATH));
      expect(copyOperation.dest).toEqual(
        getDestinationPath('empty', DESTINATION_PATH)
      );

      const directoryErrorEvent = events.filter((event) => {
        return event.name === 'createDirectoryError';
      })[0];
      expect(directoryErrorEvent.args).toHaveLength(2);

      const directoryError = directoryErrorEvent.args[0];
      const directoryCopyOperation = directoryErrorEvent.args[1];

      expect(directoryError.message).toEqual('Test error');
      expect(directoryCopyOperation.src).toEqual(
        getSourcePath('empty', SOURCE_PATH)
      );
      expect(directoryCopyOperation.dest).toEqual(
        getDestinationPath('empty', DESTINATION_PATH)
      );
      expect(
        directoryCopyOperation.stats && directoryCopyOperation.stats.isDirectory
      ).toBeTypeOf('function');
    } finally {
      vi.resetAllMocks();
    }
  });

  it('should emit symlink copy error events', async () => {
    const symlinkPath = getSourcePath('symlink', SOURCE_PATH);
    createSymbolicLink('.', symlinkPath, 'dir');

    vi.mocked(copySymlink).mockImplementationOnce(() => {
      return new Promise((_resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Test error'));
        });
      });
    });

    try {
      const copier = recursiveCopy(
        symlinkPath,
        getDestinationPath('symlink', DESTINATION_PATH)
      );
      const events = listenTo(copier, COPY_EVENTS);
      await expect(copier).rejects.toThrow('Test error');

      expect(events.map((event) => event.name)).toEqual([
        'createSymlinkStart',
        'createSymlinkError',
        'error',
      ]);

      const errorEvent = events.filter((event) => {
        return event.name === 'error';
      })[0];
      expect(errorEvent.args).toHaveLength(2);

      const error = errorEvent.args[0];
      const copyOperation = errorEvent.args[1];

      expect(error.message).toEqual('Test error');
      expect(copyOperation.src).toEqual(symlinkPath);
      expect(copyOperation.dest).toEqual(
        getDestinationPath('symlink', DESTINATION_PATH)
      );

      const symlinkErrorEvent = events.filter((event) => {
        return event.name === 'createSymlinkError';
      })[0];
      expect(symlinkErrorEvent.args).toHaveLength(2);

      const symlinkError = symlinkErrorEvent.args[0];
      const symlinkCopyOperation = symlinkErrorEvent.args[1];

      expect(symlinkError.message).toEqual('Test error');
      expect(symlinkCopyOperation.src).toEqual(symlinkPath);
      expect(symlinkCopyOperation.dest).toEqual(
        getDestinationPath('symlink', DESTINATION_PATH)
      );
      expect(
        symlinkCopyOperation.stats && symlinkCopyOperation.stats.isDirectory
      ).toBeTypeOf('function');
    } finally {
      vi.resetAllMocks();
      unlinkSync(symlinkPath);
    }
  });
});
