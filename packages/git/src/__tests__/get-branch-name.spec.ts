import { execSync } from 'node:child_process';
import { gitBranchName } from '../get-branch-name.js';

describe('get-branch-name', () => {
  it('should correct extract branch name', async () => {
    const branchName = await gitBranchName();
    const branch = execSync('git branch --show-current', {
      encoding: 'utf-8',
    }).trim();
    expect(branchName).toBe(branch);
  });
});
