import { resolve } from 'path';

import { ConfigNotFoundError } from './errors/index.js';
import { getCompilerOptions } from './get-compiler-options.js';
import type { TsconfigOpts } from './interfaces/index.js';

export class Tsconfig {
  #path: string;
  get path(): string {
    return this.#path;
  }

  constructor(path?: string) {
    this.#path = path ?? './tsconfig.json';
  }

  getOptions(projectCwd = ''): TsconfigOpts {
    try {
      const opts = getCompilerOptions(this.#path, {});
      opts.baseUrl = resolve(projectCwd, opts.baseUrl);
      opts.rootDir = resolve(projectCwd, opts.rootDir);
      opts.outDir = resolve(projectCwd, opts.outDir);
      return opts;
    } catch (err) {
      throw new ConfigNotFoundError();
    }
  }
}
