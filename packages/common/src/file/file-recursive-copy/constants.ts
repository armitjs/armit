import errno from 'errno';

export enum CopyEventType {
  ERROR = 'error',
  COMPLETE = 'complete',
  CREATE_DIRECTORY_START = 'createDirectoryStart',
  CREATE_DIRECTORY_ERROR = 'createDirectoryError',
  CREATE_DIRECTORY_COMPLETE = 'createDirectoryComplete',
  CREATE_SYMLINK_START = 'createSymlinkStart',
  CREATE_SYMLINK_ERROR = 'createSymlinkError',
  CREATE_SYMLINK_COMPLETE = 'createSymlinkComplete',
  COPY_FILE_START = 'copyFileStart',
  COPY_FILE_ERROR = 'copyFileError',
  COPY_FILE_COMPLETE = 'copyFileComplete',
}

export function fsError(code: string, path: string) {
  const errorType = errno.code[code];
  const message = errorType.code + ', ' + errorType.description + ' ' + path;
  const error = new FilesystemError(message);
  error.errno = errorType.errno;
  error.code = errorType.code;
  error.path = path;
  return error;
}

class BaseError extends Error {
  public stack: string | undefined = undefined;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export class CopyError extends BaseError {
  public error: Error | undefined = undefined;
  public data: Record<string, unknown> | undefined = undefined;
  constructor(message: string) {
    super(message);
  }
}

export class FilesystemError extends BaseError {
  public errno: number | undefined = undefined;
  public code: string | undefined = undefined;
  public path: string | undefined = undefined;
  constructor(message: string) {
    super(message);
  }
}
