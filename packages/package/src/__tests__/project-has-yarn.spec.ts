import { projectHasYarn } from '../npm-yarn.js';

describe('projectHasYarn', () => {
  it('should return true if the project/mono has a yarn.lock file', () => {
    // try to find the parent to support monorepo
    const hasYarn = projectHasYarn();
    expect(hasYarn).toBe(true);
  });
});
