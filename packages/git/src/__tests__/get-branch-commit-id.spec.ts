import { getCommitIdOfBranch } from '../get-commit-id-of-branch.js';

describe('getCommitIdOfBranch', () => {
  it('should correct last commit hash of branch', async () => {
    const hash = await getCommitIdOfBranch();
    expect(hash?.length).greaterThan(0);
    const hashworkspace = await getCommitIdOfBranch('workspace');
    expect(hashworkspace).toBe('a3f52eb46024e3275f906cb802d541f30506fb88');
  });
});
