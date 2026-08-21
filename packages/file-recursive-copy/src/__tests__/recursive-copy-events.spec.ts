import { rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import through from 'through2';
import { getDirname, rmrfSyncByPattern } from '@armit/file-utility';
import { ensureDirectoryExists } from '../ensure-directory-exists.js';
import { recursiveCopy } from '../file-recursive-copy.js';
import {
  checkResults,
  createSymbolicLink,
  getDestinationPath,
  getSourcePath,
  listenTo,
} from './copy-utils.js';

describe('recursive copy events', () => {
  const testCwd = getDirname(import.meta.url);
  const SOURCE_PATH = resolve(testCwd, './fixtures/source');
  const DESTINATION_PATH = resolve(testCwd, './fixtures/destination-events');
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
  it('should export event names and values', () => {
    expect(recursiveCopy.events).toEqual({
      ERROR: 'error',
      COMPLETE: 'complete',
      CREATE_DIRECTORY_START: 'createDirectoryStart',
      CREATE_DIRECTORY_ERROR: 'createDirectoryError',
      CREATE_DIRECTORY_COMPLETE: 'createDirectoryComplete',
      CREATE_SYMLINK_START: 'createSymlinkStart',
      CREATE_SYMLINK_ERROR: 'createSymlinkError',
      CREATE_SYMLINK_COMPLETE: 'createSymlinkComplete',
      COPY_FILE_START: 'copyFileStart',
      COPY_FILE_ERROR: 'copyFileError',
      COPY_FILE_COMPLETE: 'copyFileComplete',
    });
  });

  it('should allow event listeners to be chained', async () => {
    const copier = recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH)
    );
    await expect(async () =>
      copier
        .on('error', () => {})
        .on('complete', () => {})
        .on('createDirectoryStart', () => {})
        .on('createDirectoryError', () => {})
        .on('createDirectoryComplete', () => {})
        .on('createSymlinkStart', () => {})
        .on('createSymlinkError', () => {})
        .on('createSymlinkComplete', () => {})
        .on('copyFileStart', () => {})
        .on('copyFileError', () => {})
        .on('copyFileComplete', () => {})
        .then(() => {})
        .catch(() => {})
    ).not.toThrow();

    return copier;
  });

  it('should emit file copy events', async () => {
    const copier = recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH)
    );
    const events = listenTo(copier, COPY_EVENTS);
    await copier;

    expect(events.map((event) => event.name)).toEqual([
      'copyFileStart',
      'copyFileComplete',
      'complete',
    ]);

    const completeEvent = events.filter((event) => {
      return event.name === 'complete';
    })[0];
    expect(completeEvent.args).toHaveLength(1);

    checkResults(
      completeEvent.args[0] || [],
      {
        file: 'file',
      },
      SOURCE_PATH,
      DESTINATION_PATH
    );
  });

  it('should emit error events', async () => {
    writeFileSync(getDestinationPath('file', DESTINATION_PATH), '');

    const copier = recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH)
    );
    const events = listenTo(copier, COPY_EVENTS);
    await expect(copier).rejects.toBeDefined();

    expect(events.map((event) => event.name)).toEqual(['error']);

    const errorEvent = events.filter((event) => {
      return event.name === 'error';
    })[0];
    expect(errorEvent.args).toHaveLength(2);

    const error = errorEvent.args[0];
    const copyOperation = errorEvent.args[1];

    expect(error.code).toEqual('EEXIST');
    expect(copyOperation.src).toEqual(getSourcePath('file', SOURCE_PATH));
    expect(copyOperation.dest).toEqual(
      getDestinationPath('file', DESTINATION_PATH)
    );
  });

  it('should emit file copy error events', async () => {
    const copier = recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH),
      {
        transform: () => {
          return through((_chunk, _enc, done) => {
            done(new Error('Stream error'));
          });
        },
      }
    );
    const events = listenTo(copier, COPY_EVENTS);
    await expect(copier).rejects.toThrow('Stream error');

    expect(events.map((event) => event.name)).toEqual([
      'copyFileStart',
      'copyFileError',
      'error',
    ]);

    const errorEvent = events.filter((event) => {
      return event.name === 'error';
    })[0];
    expect(errorEvent.args).toHaveLength(2);

    const error = errorEvent.args[0];
    const copyOperation = errorEvent.args[1];

    expect(error.message).toEqual('Stream error');
    expect(copyOperation.src).toEqual(getSourcePath('file', SOURCE_PATH));
    expect(copyOperation.dest).toEqual(
      getDestinationPath('file', DESTINATION_PATH)
    );

    const fileErrorEvent = events.filter((event) => {
      return event.name === 'copyFileError';
    })[0];
    expect(fileErrorEvent.args).toHaveLength(2);

    const fileError = fileErrorEvent.args[0];
    const fileCopyOperation = fileErrorEvent.args[1];

    expect(fileError.message).toEqual('Stream error');
    expect(fileCopyOperation.src).toEqual(getSourcePath('file', SOURCE_PATH));
    expect(fileCopyOperation.dest).toEqual(
      getDestinationPath('file', DESTINATION_PATH)
    );
    expect(
      fileCopyOperation.stats && fileCopyOperation.stats.isDirectory
    ).toBeTypeOf('function');
  });

  it('should emit directory copy events', async () => {
    const copier = recursiveCopy(
      getSourcePath('empty', SOURCE_PATH),
      getDestinationPath('empty', DESTINATION_PATH)
    );
    const events = listenTo(copier, COPY_EVENTS);
    await copier;

    expect(events.map((event) => event.name)).toEqual([
      'createDirectoryStart',
      'createDirectoryComplete',
      'complete',
    ]);

    const completeEvent = events.filter((event) => {
      return event.name === 'complete';
    })[0];
    expect(completeEvent.args).toHaveLength(1);

    checkResults(
      completeEvent.args[0] || [],
      {
        empty: 'dir',
      },
      SOURCE_PATH,
      DESTINATION_PATH
    );
  });

  it('should emit symlink copy events', async () => {
    createSymbolicLink('.', getSourcePath('symlink', SOURCE_PATH), 'dir');
    const symlinkPath = getSourcePath('symlink', SOURCE_PATH);

    try {
      const copier = recursiveCopy(
        symlinkPath,
        getDestinationPath('symlink', DESTINATION_PATH)
      );
      const events = listenTo(copier, COPY_EVENTS);
      await copier;

      expect(events.map((event) => event.name)).toEqual([
        'createSymlinkStart',
        'createSymlinkComplete',
        'complete',
      ]);

      const completeEvent = events.filter((event) => {
        return event.name === 'complete';
      })[0];
      expect(completeEvent.args).toHaveLength(1);

      checkResults(
        completeEvent.args[0],
        {
          symlink: 'symlink',
        },
        SOURCE_PATH,
        DESTINATION_PATH
      );
    } finally {
      unlinkSync(symlinkPath);
    }
  });
});
