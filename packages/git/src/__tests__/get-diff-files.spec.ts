import { getDiffFiles } from '../get-diff-files.js';

describe('getDiffFiles', () => {
  it('should correct extract diff files betwwen two commit hash', async () => {
    const files = await getDiffFiles(`wrontcommithas`);
    expect(files.length).toBe(0);
  });

  it('should correct load diff files only one commit hash', async () => {
    const files = await getDiffFiles(`1fb84939b3`);
    expect(files.length).toBeGreaterThan(0);
  });

  it('should correct load diff files between two commit hash', async () => {
    const files = await getDiffFiles(`598df67`, `1fb8493`);
    expect(files).toEqual(
      expect.arrayContaining([
        '.changeset/blue-clouds-cross.md',
        'packages/cli/bin/armit.mjs',
        'packages/cli/package.json',
        'yarn.lock',
      ])
    );
  });
});
