import { groupBy } from '../array-group.js';

describe('array groupBy', () => {
  describe('array-group.ts', () => {
    it('should correct filter pattern converting', () => {
      const pets = [
        { type: 'Dog', name: 'Spot' },
        { type: 'Cat', name: 'Tiger' },
        { type: 'Dog', name: 'Rover' },
        { type: 'Cat', name: 'Leo' },
      ];
      const result = groupBy<{ type: string; name: string }>(
        pets,
        (pet) => pet.type
      );
      expect(result.get(`Dog`)).toBeDefined();
      expect(result.get(`Dog`)).toEqual(
        expect.arrayContaining([
          { type: 'Dog', name: 'Spot' },
          { type: 'Dog', name: 'Rover' },
        ])
      );
      expect(result.get(`Cat`)).toBeDefined();
      expect(result.get(`Cat`)).toEqual(
        expect.arrayContaining([
          { type: 'Cat', name: 'Tiger' },
          { type: 'Cat', name: 'Leo' },
        ])
      );
    });
  });
});
