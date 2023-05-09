/* eslint-disable @typescript-eslint/no-explicit-any */
import { type DeepPartial } from '../types.js';
import {
  isClassInstance,
  isObject,
  simpleDeepClone,
} from './simple-deep-clone.js';

const needMerge = (source, mergeUndefined?: boolean) => {
  return !(typeof source === 'undefined' && !mergeUndefined);
};

/**
 * @description
 * Performs a deep merge of two Plugin options merge objects. Unlike `Object.assign()` the `target` object is
 * not mutated, instead the function returns a new object which is the result of deeply merging the
 * values of `source` into `target`.
 *
 * Arrays do not get merged, they are treated as a single value that will be replaced. So if merging the
 * `plugins` array, you must explicitly concatenate the array.
 *
 * @example
 * ```TypeScript
 * const result = mergeOptions(defaultConfig, {
 *   assetOptions: {
 *     uploadMaxFileSize: 5000,
 *   },
 *   plugins: [
 *     ...defaultConfig.plugins,
 *     MyPlugin,
 *   ]
 * };
 * ```
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function mergeOptions<T>(
  target: T,
  source: DeepPartial<T>,
  mergeUndefined = false,
  depth = 0
): T {
  if (!source) {
    return target;
  }

  if (depth === 0) {
    target = simpleDeepClone(target as any);
  }

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!(target as any)[key]) {
          Object.assign(target, { [key]: {} });
        }
        if (!isClassInstance(source[key])) {
          mergeOptions(
            (target as any)[key],
            (source as any)[key],
            mergeUndefined,
            depth + 1
          );
        } else {
          if (needMerge(source[key], mergeUndefined)) {
            (target as any)[key] = source[key];
          }
        }
      } else {
        if (needMerge(source[key], mergeUndefined)) {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  }
  return target;
}
