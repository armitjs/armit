/**
 * @example
 * const pets = [
 *   {type:"Dog", name:"Spot"},
 *   {type:"Cat", name:"Tiger"},
 *   {type:"Dog", name:"Rover"},
 *   {type:"Cat", name:"Leo"}
 * ];
 * @param list `pets`
 * @param keyGetter `pet => pet.type`
 * @returns Map<string, T[]>
 */
export function groupBy<T>(
  list: T[],
  keyGetter: (item: T) => string
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
