import { gitBranchName } from '../get-branch-name.js';

describe('get-branch-name', () => {
  it('should correct extract branch name', async () => {
    const branchName = await gitBranchName();
    expect(branchName).toBe(`main`);
  });
});
