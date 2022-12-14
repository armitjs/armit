import { arrayUnique } from '../array-unique.js';

describe('array unique()', () => {
  it('works with primitive values', () => {
    expect(arrayUnique([1, 1, 2, 3, 2, 6, 4, 2])).toEqual([1, 2, 3, 6, 4]);
    expect(arrayUnique(['a', 'f', 'g', 'f', 'y'])).toEqual([
      'a',
      'f',
      'g',
      'y',
    ]);
    expect(arrayUnique([null, null, 1, 'a', 1])).toEqual([null, 1, 'a']);
  });

  it('works with object references', () => {
    const a = { a: true };
    const b = { b: true };
    const c = { c: true };

    expect(arrayUnique([a, b, a, b, c, a])).toEqual([a, b, c]);
    expect(arrayUnique([a, b, a, b, c, a])[0]).toBe(a);
    expect(arrayUnique([a, b, a, b, c, a])[1]).toBe(b);
    expect(arrayUnique([a, b, a, b, c, a])[2]).toBe(c);
  });

  it('works with object key param', () => {
    const a = { id: 'a', a: true };
    const b = { id: 'b', b: true };
    const c = { id: 'c', c: true };
    const d = { id: 'a', d: true };

    expect(arrayUnique([a, b, a, b, d, c, a], 'id')).toEqual([a, b, c]);
  });

  it('works an empty array', () => {
    expect(arrayUnique([])).toEqual([]);
  });

  it('perf on primitive array', async () => {
    const bigArray = Array.from({ length: 50000 }).map(() =>
      Math.random().toString().substring(2, 5)
    );
    const timeStart = new Date().getTime();
    arrayUnique(bigArray);
    const timeEnd = new Date().getTime();
    expect(timeEnd - timeStart).toBeLessThan(100);
  });

  it('perf on object array', async () => {
    const bigArray = Array.from({ length: 50000 })
      .map(() => Math.random().toString().substring(2, 5))
      .map((id) => ({ id }));
    const timeStart = new Date().getTime();
    arrayUnique(bigArray, 'id');
    const timeEnd = new Date().getTime();
    expect(timeEnd - timeStart).toBeLessThan(100);
  });
});
