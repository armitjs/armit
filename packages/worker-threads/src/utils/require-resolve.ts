import { createRequire } from 'node:module';
import { resolve } from 'import-meta-resolve';
const _require = createRequire(import.meta.url);

/**
 * Match `import.meta.resolve` except that `parent` is required (you can pass `import.meta.url`).
 * @param specifier The module specifier to resolve relative to parent
 * @returns The absolute parent module URL to resolve from.
 */
export const requireResolve = (specifier: string) => {
  try {
    // 1. first try to resolve `commonjs`
    return _require.resolve(specifier);
  } catch (err) {
    // 2. first try to resolve `esm`
    return resolve(specifier, import.meta.url);
  }
};
