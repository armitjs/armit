import { resolve } from 'path';
import type { TsconfigOpts } from './interfaces/index.js';

import { Json } from './json.js';

export function getCompilerOptions(
  path: string,
  input: Partial<TsconfigOpts>
): TsconfigOpts {
  const keys = ['baseUrl', 'rootDir', 'outDir', 'paths'];
  const json = new Json(path).loadSync();

  const pending = keys
    .filter((k) => !Object.keys(input).some((kk) => k === kk))
    .filter((k) => {
      const value = json?.compilerOptions?.[k];
      let empty = true;

      if (k === 'paths') {
        if (value && typeof value === 'object') {
          input[k] = value;
          empty = false;
        }
      } else {
        if (typeof value === 'string') {
          input[k] = value;
          empty = false;
        }
      }

      return empty;
    });

  if (pending.length && typeof json.extends === 'string') {
    const newPath = resolve(path, '..', json.extends);
    return getCompilerOptions(newPath, input);
  } else {
    return input as TsconfigOpts;
  }
}
