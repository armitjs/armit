import type { Stats } from 'node:fs';
import { rmSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import through from 'through2';
import { getDirname } from '../../dir-name.js';
import { rmrfSyncByPattern } from '../../file-write.js';
import { ensureDirectoryExists } from '../ensure-directory-exists.js';
import { recursiveCopy } from '../file-recursive-copy.js';
import {
  getDestinationPath,
  getOutputFiles,
  getSourcePath,
} from './copy-utils.js';

describe('recursive copy output transformation', () => {
  const testCwd = getDirname(import.meta.url);
  const SOURCE_PATH = resolve(testCwd, './fixtures/source');
  const DESTINATION_PATH = resolve(testCwd, './fixtures/destination-transform');

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

  it('should filter output files via function', async () => {
    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH),
      {
        filter(filePath) {
          const filename = basename(filePath);
          return filePath === '1' || filename.charAt(0) !== '1';
        },
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      '1': {},
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

  it('should filter output files via regular expression', async () => {
    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH),
      {
        filter: /(^[^1].*$)|(^1$)/,
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      '1': {},
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

  it('should filter output files via glob', async () => {
    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH),
      {
        filter: '2/**/*',
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
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
    });
  });

  it('should combine multiple filters from arrays', async () => {
    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH),
      {
        filter: [
          '1/**/*',
          '!1/1-1/**/*',
          // /^2\/(?!2-1\/).*$/,
          // (filePath) => {
          //   return filePath === 'a';
          // },
        ],
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      '1': {
        '1-1': {},
        '1-2': {
          '1-2-a': '1-2-a\n',
          '1-2-b': '1-2-b\n',
        },
        '1-a': '1-a\n',
        '1-b': '1-b\n',
      },
    });
  });

  it('should rename files', async () => {
    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH),
      {
        rename: function (path) {
          if (path === 'b') {
            return 'c';
          }
          return path;
        },
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
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
      c: 'b\n',
    });
  });

  it('should rename file paths', async () => {
    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH),
      {
        rename: function (path) {
          return path.replace(/^2/, '3').replace(/[/\\]2/g, '/3');
        },
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
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
      '3': {
        '3-1': {
          '3-1-a': '2-1-a\n',
          '3-1-b': '2-1-b\n',
        },
        '3-2': {
          '3-2-a': '2-2-a\n',
          '3-2-b': '2-2-b\n',
        },
        '3-a': '2-a\n',
        '3-b': '2-b\n',
      },
      a: 'a\n',
      b: 'b\n',
    });
  });

  it('should rename files into parent paths', async () => {
    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('parent', DESTINATION_PATH),
      {
        rename: function (path) {
          return path.replace(/^2/, '../3').replace(/[/\\]2/g, '/3');
        },
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      parent: {
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
        a: 'a\n',
        b: 'b\n',
      },
      '3': {
        '3-1': {
          '3-1-a': '2-1-a\n',
          '3-1-b': '2-1-b\n',
        },
        '3-2': {
          '3-2-a': '2-2-a\n',
          '3-2-b': '2-2-b\n',
        },
        '3-a': '2-a\n',
        '3-b': '2-b\n',
      },
    });
  });

  it('should rename files into child paths', async () => {
    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH),
      {
        rename(path) {
          return path.replace(/^2/, 'child/3').replace(/[/\\]2/g, '/3');
        },
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
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
      a: 'a\n',
      b: 'b\n',
      child: {
        '3': {
          '3-1': {
            '3-1-a': '2-1-a\n',
            '3-1-b': '2-1-b\n',
          },
          '3-2': {
            '3-2-a': '2-2-a\n',
            '3-2-b': '2-2-b\n',
          },
          '3-a': '2-a\n',
          '3-b': '2-b\n',
        },
      },
    });
  });

  it('should filter files before renaming', async () => {
    await recursiveCopy(
      getSourcePath('nested-directory', SOURCE_PATH),
      getDestinationPath('', DESTINATION_PATH),
      {
        filter(path) {
          return path === 'a';
        },
        rename: function (path) {
          if (path === 'a') {
            return 'b';
          }
          return path;
        },
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).to.eql({
      b: 'a\n',
    });
  });

  it('should transform files', async () => {
    let transformArguments: null | [src: string, dest: string, stats: Stats] =
      null;
    await recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH),
      {
        transform(...args) {
          transformArguments = args;
          return through((chunk, enc, done) => {
            done(null, chunk.toString().toUpperCase());
          });
        },
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      file: 'HELLO, WORLD!\n',
    });
    expect(transformArguments).to.exist;
    expect(transformArguments!.length).toEqual(3);
    expect(transformArguments![0]).to.equal(getSourcePath('file', SOURCE_PATH));
    expect(transformArguments![1]).to.equal(
      getDestinationPath('file', DESTINATION_PATH)
    );
    expect(transformArguments![2]).to.exist;
    expect(transformArguments![2].isFile).to.exist;
    expect(transformArguments![2].isFile()).toBe(true);
  });

  it('should allow transform to be skipped', async () => {
    await recursiveCopy(
      getSourcePath('directory', SOURCE_PATH),
      getDestinationPath('directory', DESTINATION_PATH),
      {
        transform: function (src) {
          if (basename(src) === 'b') {
            return null;
          }
          return through((chunk, enc, done) => {
            done(null, chunk.toString().toUpperCase());
          });
        },
      }
    );
    const files = await getOutputFiles(DESTINATION_PATH);
    expect(files).toEqual({
      directory: {
        a: 'A\n',
        b: 'b\n',
        c: 'C\n',
      },
    });
  });

  it('should throw an error on a transform stream error', async () => {
    const actual = recursiveCopy(
      getSourcePath('file', SOURCE_PATH),
      getDestinationPath('file', DESTINATION_PATH),
      {
        transform() {
          return through(function (chunk, enc, done) {
            done(new Error('Stream error'));
          });
        },
      }
    );
    return expect(actual).rejects.toThrow('Stream error');
  });

  it('should throw the original error on nested file error', async () => {
    try {
      await recursiveCopy(
        getSourcePath('nested-directory', SOURCE_PATH),
        getDestinationPath('nested-directory', DESTINATION_PATH),
        {
          transform(src) {
            return through((chunk, enc, done) => {
              if (
                src ===
                getSourcePath('nested-directory/1/1-1/1-1-a', SOURCE_PATH)
              ) {
                done(new Error('Stream error'));
              } else {
                done(null, chunk);
              }
            });
          },
        }
      );
    } catch (error) {
      let actual, expected;

      actual = (error as Error).name;
      expected = 'Error';
      expect(actual).toEqual(expected);

      actual = (error as Error).message;
      expected = 'Stream error';
      expect(actual).toEqual(expected);
    }
  });
});
