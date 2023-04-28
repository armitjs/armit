export function arrayUnique<T>(arr: T[]): T[] {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  return arr.filter(onlyUnique);
}
