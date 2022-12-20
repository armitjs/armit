import { lstatSync, symlinkSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import readDirFiles from 'read-dir-files';
import type { CopyOperation, WithCopyEvents } from '../types.js';

export function getSourcePath(filename: string, sourcePath: string) {
  return join(sourcePath, filename);
}

/**
 * Asynchronously reads all files from dir and returns them to the callback in form,
 * If you pass it the encoding, instead of buffers you'll get strings.
 * @example
 * ```json
 * {
*   dir: {
*     file0: <Buffer ...>,
*     file1: <Buffer ...>,
*     sub: {
*      file0: <Buffer ...>
*    }
*  }
```
 * @param destinationPath
 * @returns
 */
export function getOutputFiles(destinationPath: string) {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    readDirFiles.read(destinationPath, 'utf8', (error, files) => {
      if (error) {
        return reject(error);
      }
      return resolve(files);
    });
  });
}

export function getDestinationPath(filename: string, destinationPath: string) {
  if (!filename) {
    return destinationPath;
  }
  return join(destinationPath, filename);
}

export function checkResults(
  results: CopyOperation[],
  expectedResults: Record<string, unknown>,
  sourcePath: string,
  destinationPath: string
) {
  let actual, expected;
  actual = results.reduce((paths, copyOperation) => {
    paths[copyOperation.src] = copyOperation.dest;
    return paths;
  }, {});

  expected = Object.keys(expectedResults)
    .map((filename) => {
      return {
        src: getSourcePath(filename, sourcePath),
        dest: getDestinationPath(filename, destinationPath),
      };
    })
    .reduce((paths, copyOperation) => {
      paths[copyOperation.src] = copyOperation.dest;
      return paths;
    }, {});

  expect(actual).toEqual(expected);

  actual = results.reduce((stats, copyOperation) => {
    stats[copyOperation.dest] = getFileType(copyOperation.stats);
    return stats;
  }, {});

  expected = Object.keys(expectedResults)
    .map((filename) => {
      return {
        dest: getDestinationPath(filename, destinationPath),
        type: expectedResults[filename],
      };
    })
    .reduce((paths, copyOperation) => {
      paths[copyOperation.dest] = copyOperation.type;
      return paths;
    }, {});

  expect(actual).toEqual(expected);

  function getFileType(stats) {
    if (stats.isDirectory()) {
      return 'dir';
    }
    if (stats.isSymbolicLink()) {
      return 'symlink';
    }
    return 'file';
  }
}

export function createSymbolicLink(
  src: string,
  dest: string,
  type: 'dir' | 'file' | 'junction'
) {
  let stats;
  try {
    stats = lstatSync(dest);
  } catch (error) {
    if ((error as { code: string }).code !== 'ENOENT') {
      throw error;
    }
  }
  if (!stats) {
    symlinkSync(src, dest, type);
  } else if (!stats.isSymbolicLink()) {
    unlinkSync(dest);
    symlinkSync(src, dest, type);
  }
}

export function listenTo(
  emitter: WithCopyEvents<Promise<CopyOperation[] | undefined>>,
  eventNames
) {
  const events: Array<{ name: string; args }> = [];
  eventNames.forEach((eventName) => {
    emitter.on(eventName, createListener(eventName));
  });
  return events;

  function createListener(eventName: string) {
    return (...args) => {
      events.push({
        name: eventName,
        args,
      });
    };
  }
}
