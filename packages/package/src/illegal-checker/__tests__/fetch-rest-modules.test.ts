import { join } from 'path';
import { fetchTestModules } from '../fetch-test-modules.js';

describe('fetch-rest-modules.ts', () => {
  it('Should correct load modules with normal module name', () => {
    const result = fetchTestModules(
      ['@flatjs/common'],
      join(__dirname, 'fixtures/package.json')
    );
    expect(result.length).toBe(1);
    expect(result).toEqual([
      {
        name: '@flatjs/common',
        version: '^1.5.25',
      },
    ]);
  });

  it('Should correct load modules with relative package path', () => {
    const result = fetchTestModules(
      ['@flatjs/common'],
      'fixtures/package.json',
      __dirname
    );
    expect(result.length).toBe(1);
    expect(result).toEqual([
      {
        name: '@flatjs/common',
        version: '^1.5.25',
      },
    ]);
  });

  it('Should correct load modules with no match module', () => {
    const result = fetchTestModules(
      ['@xxx/common'],
      join(__dirname, 'fixtures/package.json')
    );
    expect(result.length).toBe(0);
  });

  it('Should correct load modules with regex pattern', () => {
    const result = fetchTestModules(
      ['@flatjs/*'],
      join(__dirname, 'fixtures/package.json')
    );
    expect(result.length).toBe(4);
    expect(result).toEqual([
      {
        name: '@flatjs/common',
        version: '^1.5.25',
      },
      {
        name: '@flatjs/evolve-preset-babel',
        version: '^1.5.23',
      },
      {
        name: '@flatjs/forge-plugin-postcss-pixel',
        version: '^1.6.0',
      },
      {
        name: '@flatjs/mock',
        version: '^1.5.25',
      },
    ]);
    const result1 = fetchTestModules(
      ['^babel-'],
      join(__dirname, 'fixtures/package.json')
    );
    expect(result1.length).toBe(3);
    expect(result1).toEqual([
      { name: 'babel-loader', version: '^9.1.2' },
      { name: 'babel-merge', version: '^3.0.0' },
      { name: 'babel-plugin-import', version: '^1.13.6' },
    ]);
  });
});
