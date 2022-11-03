import {
  ensureSlash,
  isJunkFile,
  isNotJunkFile,
  isPathMatch,
  slash,
} from '../path.js';

describe('ensureSlash', () => {
  it('Do not append a trailing slash if there is none', () => {
    expect(ensureSlash('/home/foo')).toBe('/home/foo');
  });

  it('appends a trailing slash if there is none', () => {
    expect(ensureSlash('/home/foo', true)).toBe('/home/foo/');
  });

  it('does nothing if there is already a trailing slash', () => {
    expect(ensureSlash('/home/bar/', true)).toBe('/home/bar/');
  });

  it('throws a TypeError if the argument is not a string', () => {
    expect(() => {
      ensureSlash(null as unknown as string);
    }).toThrow('input must be a string');
  });
});

describe('isPathMatch', () => {
  const excludePattern = ['!**/__MACOSX/**', '!**/*.DS_Store'];
  it('Should correct handle dotfiles', () => {
    expect(
      isPathMatch('__MACOSX/test/._demo-8ca86e6b.png', [...excludePattern])
    ).toBe(false);

    expect(isPathMatch('/test/._demo-8ca86e6b.png', [...excludePattern])).toBe(
      true
    );
    expect(
      isPathMatch('__MACOSX/test/demo-8ca86e6b.png', [
        ...excludePattern,
        '**/*.png',
      ])
    ).toBe(false);
  });

  it('Should correct handle normal file path match', () => {
    expect(
      isPathMatch('__MACOSX/test/assets/._demo-8ca86e6b.png', [
        ...excludePattern,
        '**/*.png',
      ])
    ).toBe(false);

    expect(
      isPathMatch('__MACOSX/test/assets/__MACOSX/test/._.DS_Store', [
        ...excludePattern,
      ])
    ).toBe(false);

    expect(
      isPathMatch('test/assets/demo-8ca86e6b.png', [
        ...excludePattern,
        '**/*.png',
      ])
    ).toBe(true);

    expect(
      isPathMatch('test/assets/demo-8ca86e6b.png', [
        ...excludePattern,
        '**/*.jpg',
      ])
    ).toBe(false);
  });

  it('convert backwards-slash paths to forward slash paths', () => {
    expect(slash('c:/aaaa\\bbbb')).toBe('c:/aaaa/bbbb');
    expect(slash('c:\\aaaa\\bbbb')).toBe('c:/aaaa/bbbb');
    expect(slash('c:\\aaaa\\bbbb\\★')).toBe('c:/aaaa/bbbb/★');
  });

  it('not convert extended-length paths', () => {
    const path = '\\\\?\\c:\\aaaa\\bbbb';
    expect(slash(path)).toBe(path);
  });
});

describe('junk file', () => {
  const fixture = [
    '.DS_Store',
    '.AppleDouble',
    '.LSOverride',
    'Icon\r',
    '._test',
    '.Spotlight-V100',
    '.Spotlight-V100/Store-V2/C6DBF25D-81D4-4B57-907E-B4A555E72C90/0.directoryStoreFile',
    '.Trashes',
    '__MACOSX',
    'test~',
    'Thumbs.db',
    'ehthumbs.db',
    'Desktop.ini',
    'npm-debug.log',
    '.test.swp',
    '@eaDir',
  ];

  const notFixture = ['test', 'Icon', 'Icons.woff', '.Spotlight-V100-unicorn'];

  test('matches junk files', () => {
    for (const element of fixture) {
      expect(isJunkFile(element)).toBe(true);
    }
  });

  test('does not match non-junk files', () => {
    for (const element of notFixture) {
      expect(isNotJunkFile(element)).toBe(true);
    }
  });
});
