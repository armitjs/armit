import { getCommitIdOfBranch } from '../get-commit-id-of-branch.js';

describe('getCommitIdOfBranch', () => {
  it('should correct last commit hash of branch', async () => {
    const hash = await getCommitIdOfBranch();
    expect(hash?.length).greaterThan(0);
    // FIXME: github actions don't support local `git rev-parse`
    // const main = await getCommitIdOfBranch('main', true);
    // expect(main?.length).greaterThan(0);
  });
});
