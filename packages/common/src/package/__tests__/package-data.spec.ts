import { getPackageData } from '../package-data.js';

describe('getPackageData', () => {
  it('Should correct load package data', () => {
    const packageData = getPackageData();
    expect(packageData?.version).toBeDefined();
    expect(packageData?.name).toBe('@armit/common');
  });
});
