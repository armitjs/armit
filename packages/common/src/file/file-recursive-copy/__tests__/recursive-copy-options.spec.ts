import {
  lstatSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { getDirname } from '../../dir-name.js';
import { rmrfSyncByPattern } from '../../file-write.js';
import { ensureDirectoryExists } from '../ensure-directory-exists.js';
import { recursiveCopy } from '../file-recursive-copy.js';
import {
  createSymbolicLink,
  getDestinationPath,
  getOutputFiles,
  getSourcePath,
} from './copy-utils.js';

describe('recursive copy options', () => {
  const testCwd = getDirname(import.meta.url);
  const SOURCE_PATH = resolve(testCwd, './fixtures/source');
  const DESTINATION_PATH = resolve(testCwd, './fixtures/destination');

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
  it('should overwrite destination file if overwrite is specified', async () => {
    writeFileSync(
      getDestinationPath('file', DESTINATION_PATH),
      'Goodbye, world!'
    );

    await recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH),
      {
        overwrite: true,
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      file: 'Hello, world!\n',
    });
  });

  it('should overwrite destination symlink if overwrite is specified', async () => {
    symlinkSync(
      './symlink',
      getDestinationPath('file', DESTINATION_PATH),
      'file'
    );

    await recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH),
      {
        overwrite: true,
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);

    expect(files).toEqual({
      file: 'Hello, world!\n',
    });
  });

  it('should overwrite destination directory if overwrite is specified', async () => {
    mkdirSync(getDestinationPath('file', DESTINATION_PATH));

    await recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH),
      {
        overwrite: true,
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).to.eql({
      file: 'Hello, world!\n',
    });
  });

  it('should not copy dotfiles if dotfiles is not specified', async () => {
    await recursiveCopy(
      getSourcePath('dotfiles', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH)
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      a: 'a\n',
      b: 'b\n',
    });
  });

  it('should copy dotfiles if dotfiles is specified', async () => {
    await recursiveCopy(
      getSourcePath('dotfiles', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH),
      {
        dot: true,
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      '.a': '.a\n',
      '.b': '.b\n',
      a: 'a\n',
      b: 'b\n',
    });
  });

  it('should not copy junk files if junk is not specified', async () => {
    await recursiveCopy(
      getSourcePath('junk', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH)
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      a: 'a\n',
      b: 'b\n',
    });
  });

  it('should copy junk files if junk is specified', async () => {
    await recursiveCopy(
      getSourcePath('junk', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH),
      {
        junk: true,
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      a: 'a\n',
      b: 'b\n',
      'npm-debug.log': 'npm-debug.log\n',
      'Thumbs.db': 'Thumbs.db\n',
    });
  });

  it('should expand symlinked source files if expand is specified', async () => {
    createSymbolicLink(
      './file',
      getSourcePath('file-symlink', SOURCE_PATH),
      'file'
    );
    await recursiveCopy(
      getSourcePath('file-symlink', SOURCE_PATH),
      getDestinationPath('expanded-file-symlink', DESTINATION_PATH),
      {
        expand: true,
      }
    );
    const actual = lstatSync(
      getDestinationPath('expanded-file-symlink', DESTINATION_PATH)
    ).isSymbolicLink();
    const expected = false;
    expect(actual).toEqual(expected);
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      'expanded-file-symlink': 'Hello, world!\n',
    });
  });

  it('should expand symlinked source directories if expand is specified', async () => {
    createSymbolicLink(
      './directory',
      getSourcePath('directory-symlink', SOURCE_PATH),
      'dir'
    );
    await recursiveCopy(
      getSourcePath('directory-symlink', SOURCE_PATH),
      getDestinationPath('directory-symlink', DESTINATION_PATH),
      {
        expand: true,
      }
    );
    const actual = lstatSync(
      getDestinationPath('directory-symlink', DESTINATION_PATH)
    ).isSymbolicLink();
    const expected = false;
    expect(actual).toEqual(expected);
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      'directory-symlink': {
        a: 'a\n',
        b: 'b\n',
        c: 'c\n',
      },
    });
  });

  it('should expand nested symlinks if expand is specified', async () => {
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
      getDestinationPath('expanded-nested-symlinks', DESTINATION_PATH),
      {
        expand: true,
      }
    );
    const actual = lstatSync(
      getDestinationPath('expanded-nested-symlinks', DESTINATION_PATH)
    ).isSymbolicLink();

    expect(actual).toEqual(false);
    const files = await getOutputFiles(DESTINATION_PATH);

    expect(files).toEqual({
      'expanded-nested-symlinks': {
        file: 'Hello, world!\n',
        directory: {
          a: 'a\n',
          b: 'b\n',
          c: 'c\n',
        },
        nested: {
          directory: {
            a: 'a\n',
            b: 'b\n',
            c: 'c\n',
          },
        },
      },
    });
  });
});
