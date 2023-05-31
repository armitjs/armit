import { getLastCommitHash } from '../get-last-commit-hash.js';

describe('getLastCommitHash', () => {
  it('should correct extract last commit hash', async () => {
    const hash = await getLastCommitHash();
    expect(hash?.length).toBe(7);
  });
});
