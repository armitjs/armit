import type { Stats } from 'node:fs';
import { dirname } from 'node:path';
import type { CopyEventType } from './constants.js';
import { ensureDirectoryExists } from './ensure-directory-exists.js';
import type {
  CopyOperation,
  CopyTaskFn,
  EmitEventFn,
  RecursiveCopyOptions,
} from './types.js';

type CreateCopyFunctionEvents = {
  startEvent: CopyEventType;
  completeEvent: CopyEventType;
  errorEvent: CopyEventType;
};

export function createCopyFunction(
  copyFn: CopyTaskFn,
  stats: Stats,
  hasFinished: () => boolean,
  emitEvent: EmitEventFn,
  events: CreateCopyFunctionEvents
) {
  const startEvent = events.startEvent;
  const completeEvent = events.completeEvent;
  const errorEvent = events.errorEvent;
  return async (
    srcPath: string,
    destPath: string,
    stats: Stats,
    options: RecursiveCopyOptions
  ) => {
    // Multiple chains of promises are fired in parallel,
    // so when one fails we need to prevent any future
    // copy operations
    if (hasFinished()) {
      return Promise.reject();
    }
    const metadata: CopyOperation = {
      src: srcPath,
      dest: destPath,
      stats: stats,
    };

    emitEvent(startEvent, metadata);
    const parentDirectory = dirname(destPath);

    await ensureDirectoryExists(parentDirectory);

    try {
      await copyFn(srcPath, destPath, stats, options);
      if (!hasFinished()) {
        emitEvent(completeEvent, metadata);
      }
      return metadata;
    } catch (error) {
      if (!hasFinished()) {
        emitEvent(errorEvent, error, metadata);
      }
      throw error;
    }
  };
}
