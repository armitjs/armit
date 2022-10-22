import { getPackageData } from '../package-data.js';

describe('getPackageData', () => {
  it('Should correct load package data', () => {
    const packageData = getPackageData({
      cwd: process.cwd(),
    });
    expect(packageData?.version).toBeDefined();
    expect(packageData?.name).toBe('@armit/common');
  });
});
