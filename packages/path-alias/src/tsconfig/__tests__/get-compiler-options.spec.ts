import { getCompilerOptions } from '../get-compiler-options.js';

describe('get compiler options', () => {
  test('Read "tsconfig.01.json"', () => {
    const options = getCompilerOptions('./tsconfig-tests/tsconfig.01.json', {});

    expect(options).toMatchObject({
      rootDir: './src',
      outDir: './dist',
      baseUrl: './src',
      paths: {
        '@models/*': ['./models/*'],
        '@tool/*': ['./tool/*'],
      },
    });
  });

  test('Read "tsconfig.02.json"', () => {
    const options = getCompilerOptions('./tsconfig-tests/tsconfig.02.json', {});

    expect(options).toMatchObject({
      rootDir: './src',
      outDir: './dist',
      baseUrl: './src',
      paths: {
        '@models/*': ['./models/*'],
        '@tool/*': ['./tool/*'],
      },
    });
  });

  test('Read "tsconfig.03.json"', () => {
    const options = getCompilerOptions('./tsconfig-tests/tsconfig.03.json', {});

    expect(options).toMatchObject({
      rootDir: './src',
      outDir: './dist',
      baseUrl: './src',
      paths: {
        '@models/*': ['./models/*'],
        '@tool/*': ['./tool/*'],
      },
    });
  });
});
