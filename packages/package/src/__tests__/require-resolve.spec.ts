import { getDirname } from '@armit/file-utility';
import { requireResolve } from '../helpers/require-resolve.js';

describe('esm resover', () => {
  it('should correct resolve node modules for esm modules', async () => {
    const modulePath = requireResolve(import.meta.url, 'execa');
    expect(modulePath).toBeDefined();
    if (modulePath) {
      const result = await import(modulePath);
      expect(typeof result.loadConfig).toBeDefined();
    }
  });

  it('should correct resolve node modules for commonjs modules', async () => {
    const modulePath = requireResolve(import.meta.url, 'cosmiconfig');

    expect(modulePath).toBeDefined();
    if (modulePath) {
      const result = await import(modulePath);
      expect(result).toHaveProperty('default');
      expect(typeof result.default.cosmiconfig).toBe('function');
      expect(typeof result.default.cosmiconfigSync).toBe('function');
    }
  });

  it('should correct resolve node modules with absolute path for commonjs', async () => {
    const modulePath = getDirname(
      import.meta.url,
      '../../../../node_modules/cosmiconfig/dist/index.js'
    );

    expect(modulePath).toBeDefined();
    const modulePath2 = requireResolve(import.meta.url, modulePath);
    expect(modulePath2).toBeDefined();

    if (modulePath2) {
      const result = await import(modulePath);
      expect(result).toHaveProperty('default');
      expect(typeof result.default.cosmiconfig).toBe('function');
      expect(typeof result.default.cosmiconfigSync).toBe('function');
    }
  });

  it('should correct resolve node modules with absolute path for esm', async () => {
    const modulePath = getDirname(
      import.meta.url,
      '../../../../node_modules/execa/index.js'
    );

    expect(modulePath).toBeDefined();
    const modulePath2 = requireResolve(import.meta.url, modulePath);

    expect(modulePath2).toBeDefined();

    if (modulePath2) {
      const result = await import(modulePath2);
      expect(typeof result.execa).toBe('function');
    }
  });

  it('should correct resolve node modules with relative path for `esm`', async () => {
    const modulePath = '../../../../node_modules/execa/index.js';
    expect(modulePath).toBeDefined();
    const modulePath2 = requireResolve(import.meta.url, modulePath);
    expect(modulePath2).toBeDefined();
    if (modulePath2) {
      const result = await import(modulePath2);
      expect(typeof result.execa).toBe('function');
    }
  });

  it('should throw exception if module not found', async () => {
    const modulePath = '../../../../node_modules/@armit/config-xxxxx/index.js';
    expect(
      !!~requireResolve(import.meta.url, modulePath).indexOf(
        '@armit/config-xxxxx/index.js'
      )
    ).toBe(true);

    expect(() => {
      requireResolve(import.meta.url, `modulePath`);
    }).toThrowError();
  });
});
