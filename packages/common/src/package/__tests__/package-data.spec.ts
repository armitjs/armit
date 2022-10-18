import { getPackageData } from '@armit/common';

describe('getPackageData', () => {
  it('Should correct load package data', () => {
    const packageData = getPackageData();
    expect(packageData?.version).toBeDefined();
    expect(packageData?.name).toBe(expect.stringContaining('@armit/common'));
  });
});
