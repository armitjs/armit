import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFileCommitStatus } from '../get-file-commit-status.js';

describe('get-file-commit-status', () => {
  const fixtureCwd = dirname(fileURLToPath(import.meta.url));

  it('should correct extract check filename commited status', async () => {
    const testFile = join(fixtureCwd, `../../.eslintrc.cjs`);
    const testFileNo = join(fixtureCwd, `../../.eslintrc-x.cjs`);

    const isCommitted = await getFileCommitStatus(testFile);
    expect(isCommitted).toBe(true);
    const isCommitted2 = await getFileCommitStatus(testFileNo);
    expect(isCommitted2).toBe(false);
  });
});
