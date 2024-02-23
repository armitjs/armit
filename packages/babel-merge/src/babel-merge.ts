import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  resolvePlugin,
  type TransformOptions,
  type PluginItem,
  resolvePreset,
} from '@babel/core';
import merge, { type Options } from 'deepmerge';
import omit from 'object.omit';

function arrayMerge(
  source: Array<PluginItem> = [],
  overrides: Array<PluginItem> = []
) {
  return [...new Set([...source, ...overrides])];
}

/**
 * Provider method to simulate __dirname veriable.
 * @param url import.meta.url
 * @param paths paths to join.
 */
const getDirname = (url: string, ...paths: string[]) => {
  return join(dirname(fileURLToPath(url)), ...paths);
};

function mergeArray(
  source: Array<PluginItem> = [],
  overrides: Array<PluginItem> = [],
  resolve: typeof resolvePlugin,
  deepmergeOpts: Options = {}
) {
  return [...source, ...overrides].reduce<Array<PluginItem>>(
    (reduction, override) => {
      const overrideName = resolve(
        Array.isArray(override) ? override[0] : override,
        getDirname(import.meta.url)
      );
      const overrideOptions = Array.isArray(override) ? override[1] : {};

      const base = reduction.find((base) => {
        const baseName = resolve(Array.isArray(base) ? base[0] : base, '');
        return (
          baseName &&
          (baseName === overrideName || baseName.includes(overrideName || ''))
        );
      });

      const index = base
        ? reduction.includes(base)
          ? reduction.indexOf(base)
          : reduction.length
        : reduction.length;

      const baseName = base
        ? resolve(Array.isArray(base) ? base[0] : base, '')
        : overrideName;

      const baseOptions = Array.isArray(base) ? base[1] : {};
      const options: Record<string, unknown> = merge(
        baseOptions,
        overrideOptions,
        {
          arrayMerge,
          isMergeableObject: (value) => Array.isArray(value),
          ...deepmergeOpts,
        }
      );

      reduction[index] = Object.keys(options).length
        ? [baseName, options]
        : baseName || '';

      return reduction;
    },
    []
  );
}

export function babelMerge(
  source: TransformOptions,
  overrides: TransformOptions = {},
  deepmergeOpts: Options = {}
) {
  // merge plugins
  const plugins = mergeArray(
    source.plugins || [],
    overrides.plugins || [],
    resolvePlugin,
    deepmergeOpts
  );
  // merge presets
  const presets = mergeArray(
    source.presets || [],
    overrides.presets || [],
    resolvePreset,
    deepmergeOpts
  );

  const sourceEnv = source.env || {};
  const overridesEnv = overrides.env || {};
  return Object.assign(
    presets.length ? { presets } : {},
    plugins.length ? { plugins } : {},
    merge.all(
      [
        omit(source, ['plugins', 'presets', 'env']),
        omit(overrides, ['plugins', 'presets', 'env']),
        ...[
          ...new Set([...Object.keys(sourceEnv), ...Object.keys(overridesEnv)]),
        ].map((name) => ({
          env: {
            [name]: babelMerge(
              sourceEnv[name] || {},
              overridesEnv[name] || {},
              deepmergeOpts
            ),
          },
        })),
      ],
      { arrayMerge, ...deepmergeOpts }
    )
  );
}

export function babelMergeAll(
  values: TransformOptions[] = [],
  deepmergeOpts: Options = {}
) {
  return values.reduce((acc, value) => {
    if (value) {
      Object.assign(acc, babelMerge(acc, value, deepmergeOpts));
    }
    return acc;
  }, {});
}
