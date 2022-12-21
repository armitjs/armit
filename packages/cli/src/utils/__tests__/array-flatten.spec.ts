import { arrayFlatten } from '../array-flatten.js';

describe('array flatten()', () => {
  it('works with deep level flatten default 1', () => {
    expect(arrayFlatten([1, 2, [3, 4, [5, 6]]])).toEqual([1, 2, 3, 4, [5, 6]]);
  });

  it('works with deep level flatten with depth 2', () => {
    expect(arrayFlatten([1, 2, [3, 4, [5, 6]]], 2)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('works with deep level flatten with depth geater than 2', () => {
    expect(arrayFlatten([1, 2, [3, 4, [5, 6]]], 3)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
