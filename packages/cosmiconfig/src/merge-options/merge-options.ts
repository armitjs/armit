/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isClassInstance,
  isObject,
  simpleDeepClone,
} from './simple-deep-clone.js';
/**
 * A recursive implementation of the Partial<T> type.
 * Source: https://stackoverflow.com/a/49936686/772859
 */
export type DeepPartial<T> = {
  [P in keyof T]?:
    | null
    | (T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>);
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
          mergeOptions((target as any)[key], (source as any)[key], depth + 1);
        } else {
          (target as any)[key] = source[key];
        }
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
}
