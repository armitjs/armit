import { dirname, join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { pathAlias } from '../path-alias.js';
import { leftReplacer } from '../tool/left-replacer.js';
import { searchMonoProjectDir } from '../tool/search-mono-project-dir.js';
import { Tsconfig } from '../tsconfig/tsconfig.js';

export function replace(input: string, parentUrl?: string): string | undefined {
  // ParentURL is required
  if (typeof parentUrl !== 'string') {
    return input;
  }

  // Check if inside of...
  const path =
    process.platform !== 'win32'
      ? new URL(parentUrl).pathname
      : new URL(parentUrl).pathname
          .replace(/^(\\|\/)+/g, '')
          .replace(/\//g, '\\');

  const projectCwd = searchMonoProjectDir({
    cwd: dirname(path),
  });

  const tsconfig = new Tsconfig(
    projectCwd ? join(projectCwd, './tsconfig.json') : undefined
  );
  const tsconfigOpts = tsconfig.getOptions(projectCwd);

  const base = pathAlias.isTsNode
    ? resolve(tsconfigOpts.baseUrl)
    : leftReplacer(
        resolve(tsconfigOpts.baseUrl),
        resolve(tsconfigOpts.rootDir),
        resolve(tsconfigOpts.outDir)
      );

  if (path.startsWith(base)) {
    const found = Object.entries(tsconfigOpts.paths)
      .map(([k, v]) => ({
        alias: k.replace(/\*/g, ''),
        path: v[0]?.replace(/\*/g, ''),
      }))
      .find(({ alias }) => input.startsWith(alias));

    if (found) {
      const fullPath = resolve(base, found.path);
      const result =
        input !== found.alias
          ? join(fullPath, leftReplacer(input, found.alias, ''))
          : fullPath;

      let out: string;
      if (pathAlias.isTsNode) {
        out = result.replace(/\.js$/gi, '.ts').replace(/\.mjs$/gi, '.mts');
      } else {
        out = result.replace(/\.ts$/gi, '.js').replace(/\.mts$/gi, '.mjs');
      }

      if (process.platform === 'win32') {
        return pathToFileURL(out).href;
      } else {
        return out;
      }
    }
  }

  return undefined;
}
