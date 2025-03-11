/**
 * Creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.
 * @param arr The array to flatten.
 * @param depth default 1
 * @returns A new array with the sub-array elements concatenated into it.
 */
export function arrayFlatten<T>(arr, depth = 1): T {
  if (!Array.isArray(arr)) {
    return arr;
  }
  return depth > 0
    ? arr.reduce((acc, val) => acc.concat(arrayFlatten(val, depth - 1)), [])
    : (arr.slice() as T);
}
