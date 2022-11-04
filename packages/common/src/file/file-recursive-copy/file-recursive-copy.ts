import { EventEmitter } from 'node:events';
import type { Stats } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { DefaultLogger, LogLevel } from '../../logger/logger.js';
import { CopyError, CopyEventType } from './constants.js';
import { copyDirectory, copyFile, copySymlink } from './copy-task.js';
import { createCopyFunction } from './create-copy-function.js';
import { ensureDirectoryExists } from './ensure-directory-exists.js';
import { getFilePaths } from './get-file-paths.js';
import { getFilteredPaths } from './get-filtered-paths.js';
import { prepareForCopy } from './prepare-for-copy.js';
import type {
  CopyOperation,
  EmitEventFn,
  RecursiveCopyOptions,
} from './types.js';

/**
 * Recursively copy files and folders from src to dest
 * @param src Source file/folder path
 * @param dest Destination file/folder path
 * @param options
 * @param callback Callback, invoked on success/failure
 * @returns
 */
export const recursiveCopy = async (
  src: string,
  dest: string,
  options: RecursiveCopyOptions = {}
): Promise<CopyOperation[] | undefined> => {
  const parentDirectory = dirname(dest);
  const shouldExpandSymlinks = Boolean(options.expand);
  const logger = new DefaultLogger({
    level: options.debug ? LogLevel.Debug : LogLevel.Warn,
    context: 'file-recursive-copy',
  });

  let emitter: EventEmitter;
  let hasFinished = false;

  logger.debug('Ensuring output directory exists…');
  await ensureDirectoryExists(parentDirectory);

  logger.debug('Fetching source paths…');
  const filePaths = await getFilePaths(src, shouldExpandSymlinks);

  logger.debug('Filtering source paths…');
  const relativePaths = filePaths.map((filePath) => {
    return relative(src, filePath);
  });

  const filteredPaths = getFilteredPaths(relativePaths, options.filter, {
    dot: options.dot,
    junk: options.junk,
  });

  const operations = filteredPaths.map((relativePath) => {
    const inputPath = relativePath;
    const outputPath = options.rename ? options.rename(inputPath) : inputPath;
    return {
      src: join(src, inputPath),
      dest: join(dest, outputPath),
    };
  });

  logger.debug('Copying files…');

  const hasFinishedGetter = () => {
    return hasFinished;
  };

  const emitEvent = (eventName: string, ...args) => {
    emitter.emit(eventName, ...args);
  };

  const promise = batch(
    operations,
    (operation) => {
      return copy(
        operation.src,
        operation.dest,
        hasFinishedGetter,
        emitEvent,
        options,
        logger
      );
    },
    {
      results: options.results !== false,
      concurrency: options.concurrency || 255,
    }
  )
    .catch((error) => {
      logger.debug('Copy failed');
      // catch throw to finnal catch() directly.
      if (error instanceof CopyError) {
        emitter.emit(CopyEventType.ERROR, error.error, error.data);
        throw error.error;
      } else {
        throw error;
      }
    })
    .then((results) => {
      logger.debug('Copy complete');
      emitter.emit(CopyEventType.COMPLETE, results);
      return results;
    })
    .then((results) => {
      hasFinished = true;
      return results;
    })
    .catch((error) => {
      hasFinished = true;
      throw error;
    });

  return (emitter = withEventEmitter(promise));
};

recursiveCopy.events = CopyEventType;

function batch(
  inputs: Array<{ src: string; dest: string }>,
  iteratee: (operation: {
    src: string;
    dest: string;
  }) => Promise<CopyOperation>,
  options
): Promise<Array<CopyOperation> | undefined> {
  const results: Array<CopyOperation> | undefined = options.results
    ? []
    : undefined;
  if (inputs.length === 0) {
    return Promise.resolve(results);
  }
  return new Promise((resolve, reject) => {
    let currentIndex = -1;
    let activeWorkers = 0;
    while (currentIndex < Math.min(inputs.length, options.concurrency) - 1) {
      startWorker(inputs[++currentIndex]);
    }

    function startWorker(input: { src: string; dest: string }) {
      ++activeWorkers;
      iteratee(input)
        .then((result) => {
          --activeWorkers;
          if (results) {
            results.push(result);
          }
          if (currentIndex < inputs.length - 1) {
            startWorker(inputs[++currentIndex]);
          } else if (activeWorkers === 0) {
            resolve(results);
          }
        })
        .catch(reject);
    }
  });
}

function copy(
  srcPath: string,
  destPath: string,
  hasFinished: () => boolean,
  emitEvent: EmitEventFn,
  options: RecursiveCopyOptions,
  logger: DefaultLogger
): Promise<CopyOperation> {
  logger.debug('Preparing to copy ' + srcPath + '…');
  return prepareForCopy(srcPath, destPath, options)
    .then((stats) => {
      logger.debug('Copying ' + srcPath + '…');
      const copyFunction = getCopyFunction(stats, hasFinished, emitEvent);
      return copyFunction(srcPath, destPath, stats, options);
    })
    .catch((error) => {
      if (error instanceof CopyError) {
        throw error;
      }
      const copyError = new CopyError(error.message);
      copyError.error = error;
      copyError.data = {
        src: srcPath,
        dest: destPath,
      };
      throw copyError;
    })
    .then((result) => {
      logger.debug('Copied ' + srcPath);
      return result;
    });
}

function getCopyFunction(stats: Stats, hasFinished: () => boolean, emitEvent) {
  if (stats.isDirectory()) {
    return createCopyFunction(copyDirectory, stats, hasFinished, emitEvent, {
      startEvent: CopyEventType.CREATE_DIRECTORY_START,
      completeEvent: CopyEventType.CREATE_DIRECTORY_COMPLETE,
      errorEvent: CopyEventType.CREATE_DIRECTORY_ERROR,
    });
  } else if (stats.isSymbolicLink()) {
    return createCopyFunction(copySymlink, stats, hasFinished, emitEvent, {
      startEvent: CopyEventType.CREATE_SYMLINK_START,
      completeEvent: CopyEventType.CREATE_SYMLINK_COMPLETE,
      errorEvent: CopyEventType.CREATE_SYMLINK_ERROR,
    });
  } else {
    return createCopyFunction(copyFile, stats, hasFinished, emitEvent, {
      startEvent: CopyEventType.COPY_FILE_START,
      completeEvent: CopyEventType.COPY_FILE_COMPLETE,
      errorEvent: CopyEventType.COPY_FILE_ERROR,
    });
  }
}

function withEventEmitter(target) {
  for (const key in EventEmitter.prototype) {
    target[key] = EventEmitter.prototype[key];
  }
  EventEmitter.call(target);
  return target;
}
