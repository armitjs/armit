import { rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import through from 'through2';
import { getDirname } from '../../dir-name.js';
import { rmrfSyncByPattern } from '../../file-write.js';
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
    expect(async () => {
      return await copier
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
        .catch(() => {});
    }).to.not.throw();

    return copier;
  });

  it('should emit file copy events', () => {
    const copier = recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH)
    );
    const events = listenTo(copier, COPY_EVENTS);
    return copier.then(() => {
      let actual, expected;

      const eventNames = events.map((event) => {
        return event.name;
      });

      actual = eventNames;
      expected = ['copyFileStart', 'copyFileComplete', 'complete'];
      expect(actual).toEqual(expected);

      const completeEvent = events.filter((event) => {
        return event.name === 'complete';
      })[0];
      const eventArgs = completeEvent.args;

      actual = eventArgs.length;
      expected = 1;
      expect(actual).toEqual(expected);

      const results = eventArgs[0];
      checkResults(
        results || [],
        {
          file: 'file',
        },
        SOURCE_PATH,
        DESTINATION_PATH
      );
    });
  });

  it('should emit error events', async () => {
    writeFileSync(getDestinationPath('file', DESTINATION_PATH), '');

    const copier = recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH)
    );
    const events = listenTo(copier, COPY_EVENTS);
    return copier.catch(() => {
      let actual, expected;

      const eventNames = events.map((event) => {
        return event.name;
      });

      actual = eventNames;
      expected = ['error'];
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

      actual = error.code;
      expected = 'EEXIST';
      expect(actual).toEqual(expected);

      actual = copyOperation.src;
      expected = getSourcePath('file', SOURCE_PATH);
      expect(actual).toEqual(expected);

      actual = copyOperation.dest;
      expected = getDestinationPath('file', DESTINATION_PATH);
      expect(actual).toEqual(expected);
    });
  });

  it('should emit file copy error events', () => {
    const copier = recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH),
      {
        transform: () => {
          return through((chunk, enc, done) => {
            done(new Error('Stream error'));
          });
        },
      }
    );
    const events = listenTo(copier, COPY_EVENTS);
    return copier.catch(() => {
      let actual, expected;

      const eventNames = events.map(function (event) {
        return event.name;
      });

      actual = eventNames;
      expected = ['copyFileStart', 'copyFileError', 'error'];
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
      expected = 'Stream error';
      expect(actual).toEqual(expected);

      actual = copyOperation.src;
      expected = getSourcePath('file', SOURCE_PATH);
      expect(actual).toEqual(expected);

      actual = copyOperation.dest;
      expected = getDestinationPath('file', DESTINATION_PATH);
      expect(actual).toEqual(expected);

      const fileErrorEvent = events.filter((event) => {
        return event.name === 'copyFileError';
      })[0];
      const fileErrorEventArgs = fileErrorEvent.args;

      actual = fileErrorEventArgs.length;
      expected = 2;
      expect(actual).toEqual(expected);

      const fileError = fileErrorEventArgs[0];
      const fileCopyOperation = fileErrorEventArgs[1];

      actual = fileError.message;
      expected = 'Stream error';
      expect(actual).toEqual(expected);

      actual = fileCopyOperation.src;
      expected = getSourcePath('file', SOURCE_PATH);
      expect(actual).toEqual(expected);

      actual = fileCopyOperation.dest;
      expected = getDestinationPath('file', DESTINATION_PATH);
      expect(actual).toEqual(expected);

      actual = fileCopyOperation.stats && fileCopyOperation.stats.isDirectory;
      expected = 'function';
      expect(actual).to.be.a(expected);
    });
  });

  it('should emit directory copy events', async () => {
    const copier = recursiveCopy(
      getSourcePath('empty', SOURCE_PATH),
      getDestinationPath('empty', DESTINATION_PATH)
    );
    const events = listenTo(copier, COPY_EVENTS);
    return copier.then(() => {
      let actual, expected;

      const eventNames = events.map((event) => {
        return event.name;
      });

      actual = eventNames;
      expected = [
        'createDirectoryStart',
        'createDirectoryComplete',
        'complete',
      ];
      expect(actual).toEqual(expected);

      const completeEvent = events.filter((event) => {
        return event.name === 'complete';
      })[0];
      const eventArgs = completeEvent.args;

      actual = eventArgs.length;
      expected = 1;
      expect(actual).toEqual(expected);

      const results = eventArgs[0];
      checkResults(
        results || [],
        {
          empty: 'dir',
        },
        SOURCE_PATH,
        DESTINATION_PATH
      );
    });
  });

  it('should emit symlink copy events', async () => {
    createSymbolicLink('.', getSourcePath('symlink', SOURCE_PATH), 'dir');
    const copier = recursiveCopy(
      getSourcePath('symlink', SOURCE_PATH),
      getDestinationPath('symlink', DESTINATION_PATH)
    );
    const events = listenTo(copier, COPY_EVENTS);
    return copier.then(() => {
      let actual, expected;

      const eventNames = events.map((event) => {
        return event.name;
      });

      actual = eventNames;
      expected = ['createSymlinkStart', 'createSymlinkComplete', 'complete'];
      expect(actual).toEqual(expected);

      const completeEvent = events.filter((event) => {
        return event.name === 'complete';
      })[0];
      const eventArgs = completeEvent.args;

      actual = eventArgs.length;
      expected = 1;
      expect(actual).toEqual(expected);

      const results = eventArgs[0];
      checkResults(
        results,
        {
          symlink: 'symlink',
        },
        SOURCE_PATH,
        DESTINATION_PATH
      );
    });
  });
});
