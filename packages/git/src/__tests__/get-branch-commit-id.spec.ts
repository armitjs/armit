import { getCommitIdOfBranch } from '../get-commit-id-of-branch.js';

describe('getCommitIdOfBranch', () => {
  it('should correct last commit hash of branch', async () => {
    const hash = await getCommitIdOfBranch();
    expect(hash?.length).greaterThan(0);
    const main = await getCommitIdOfBranch('main');
    expect(main?.length).greaterThan(0);
  });
});
