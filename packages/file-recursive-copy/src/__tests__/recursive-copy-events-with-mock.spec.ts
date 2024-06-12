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
  vi.mock('../copy-task.js', () => {
    return {
      copyDirectory: vi.fn(),
      copySymlink: vi.fn(),
    };
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
    vi.mocked(copyDirectory).mockImplementationOnce((srcPath, destPath) => {
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

    const copier = recursiveCopy(
      getSourcePath('empty', SOURCE_PATH),
      getDestinationPath('empty', DESTINATION_PATH)
    );
    const events = listenTo(copier, COPY_EVENTS);
    return copier
      .catch(() => {
        let actual, expected;

        const eventNames = events.map((event) => {
          return event.name;
        });

        actual = eventNames;
        expected = ['createDirectoryStart', 'createDirectoryError', 'error'];
        expect(actual).toEqual(expected);

        const errorEvent = events.filter((event) => {
          return event.name === 'error';
        })[0];
        const eventArgs = errorEvent.args;

        actual = eventArgs.length;
        expected = 2;
        expect(actual).toEqual(expected);

        const error = eventArgs[0];
        const copyOperation = eventArgs[1];

        actual = error.message;
        expected = 'Test error';
        expect(actual).toEqual(expected);

        actual = copyOperation.src;
        expected = getSourcePath('empty', SOURCE_PATH);
        expect(actual).toEqual(expected);

        actual = copyOperation.dest;
        expected = getDestinationPath('empty', DESTINATION_PATH);
        expect(actual).toEqual(expected);

        const directoryErrorEvent = events.filter((event) => {
          return event.name === 'createDirectoryError';
        })[0];
        const directoryErrorEventArgs = directoryErrorEvent.args;

        actual = directoryErrorEventArgs.length;
        expected = 2;
        expect(actual).toEqual(expected);

        const directoryError = directoryErrorEventArgs[0];
        const directoryCopyOperation = directoryErrorEventArgs[1];

        actual = directoryError.message;
        expected = 'Test error';
        expect(actual).toEqual(expected);

        actual = directoryCopyOperation.src;
        expected = getSourcePath('empty', SOURCE_PATH);
        expect(actual).toEqual(expected);

        actual = directoryCopyOperation.dest;
        expected = getDestinationPath('empty', DESTINATION_PATH);
        expect(actual).toEqual(expected);

        actual =
          directoryCopyOperation.stats &&
          directoryCopyOperation.stats.isDirectory;
        expected = 'function';
        expect(actual).toBe(expected);
      })
      .then(() => {
        vi.resetAllMocks();
      })
      .catch(() => {
        vi.resetAllMocks();
      });
  });

  it('should emit symlink copy error events', async () => {
    createSymbolicLink('.', getSourcePath('symlink', SOURCE_PATH), 'dir');

    vi.mocked(copySymlink).mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Test error'));
        });
      });
    });

    const copier = recursiveCopy(
      getSourcePath('symlink', SOURCE_PATH),
      getDestinationPath('symlink', DESTINATION_PATH)
    );
    const events = listenTo(copier, COPY_EVENTS);
    return copier
      .catch(() => {
        let actual, expected;

        const eventNames = events.map((event) => {
          return event.name;
        });

        actual = eventNames;
        expected = ['createSymlinkStart', 'createSymlinkError', 'error'];
        expect(actual).toEqual(expected);

        const errorEvent = events.filter((event) => {
          return event.name === 'error';
        })[0];
        const eventArgs = errorEvent.args;

        actual = eventArgs.length;
        expected = 2;
        expect(actual).toEqual(expected);

        const error = eventArgs[0];
        const copyOperation = eventArgs[1];

        actual = error.message;
        expected = 'Test error';
        expect(actual).toEqual(expected);

        actual = copyOperation.src;
        expected = getSourcePath('symlink', SOURCE_PATH);
        expect(actual).toEqual(expected);

        actual = copyOperation.dest;
        expected = getDestinationPath('symlink', DESTINATION_PATH);
        expect(actual).toEqual(expected);

        const symlinkErrorEvent = events.filter((event) => {
          return event.name === 'createSymlinkError';
        })[0];
        const symlinkErrorEventArgs = symlinkErrorEvent.args;

        actual = symlinkErrorEventArgs.length;
        expected = 2;
        expect(actual).toEqual(expected);

        const symlinkError = symlinkErrorEventArgs[0];
        const symlinkCopyOperation = symlinkErrorEventArgs[1];

        actual = symlinkError.message;
        expected = 'Test error';
        expect(actual).toEqual(expected);

        actual = symlinkCopyOperation.src;
        expected = getSourcePath('symlink', SOURCE_PATH);
        expect(actual).toEqual(expected);

        actual = symlinkCopyOperation.dest;
        expected = getDestinationPath('symlink', DESTINATION_PATH);
        expect(actual).toEqual(expected);

        actual =
          symlinkCopyOperation.stats && symlinkCopyOperation.stats.isDirectory;
        expected = 'function';
        expect(actual).toBeTypeOf(expected);
      })
      .then(() => {
        vi.resetAllMocks();
        unlinkSync(getSourcePath('symlink', SOURCE_PATH));
      })
      .catch((error) => {
        vi.resetAllMocks();
        unlinkSync(getSourcePath('symlink', SOURCE_PATH));

        throw error;
      });
  });
});
