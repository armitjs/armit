import { ensureSlash, isPathMatch } from '../path.js';

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
});
