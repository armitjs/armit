import { createRequire } from 'node:module';
import type { Loader } from 'cosmiconfig';
import type { RegisterOptions, Service } from 'ts-node';
import { TsCompileError } from './ts-compile-error.js';

const cjsRequire = createRequire(import.meta.url);

export function instanceOfNodeError(
  error: unknown
): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    // https://github.com/DefinitelyTyped/DefinitelyTyped/commit/cddd0b7aab18761214d26a0c7012cf45de5285a9
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as Record<string, any>).code !== undefined
  );
}

export function tsLoader(options?: RegisterOptions): Loader {
  let tsNodeInstance: Service;

  return async (path: string, content: string) => {
    if (!tsNodeInstance) {
      try {
        const { register } = await import('ts-node');
        tsNodeInstance = register({
          ...options,
          compilerOptions: { module: 'commonjs' },
        });
      } catch (error) {
        if (
          instanceOfNodeError(error) &&
          error.code === 'ERR_MODULE_NOT_FOUND'
        ) {
          throw new Error(
            "@armit/config-loader: 'ts-node' is required for loading TypeScript cosmiconfig configuration files." +
              `Make sure it is installed\nError: ${error.message}`
          );
        }
        throw error;
      }
    }

    try {
      // cosmiconfig requires the transpiled configuration to be CJS
      tsNodeInstance.compile(content, path);
      const result = cjsRequire(path);
      // `default` is used when exporting using export default, some modules
      // may still use `module.exports` or if in TS `export = `
      return result.default || result;
    } catch (error) {
      if (error instanceof Error) {
        // Coerce generic error instance into typed error with better logging.
        throw TsCompileError.fromError(error);
      }
      throw error;
    }
  };
}
