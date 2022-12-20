import { readPackageData } from '../package-data.js';

describe('readPackageData', () => {
  it('Should correct load package data', () => {
    const packageData = readPackageData({
      cwd: process.cwd(),
    });
    expect(packageData?.version).toBeDefined();
    expect(packageData?.name).toBe('@armit/package');
  });
});
