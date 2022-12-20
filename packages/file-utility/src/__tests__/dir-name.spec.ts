import { getDirname } from '../get-dir-name.js';

describe('getDirname', () => {
  it('should correct dynamic determined __dirname', () => {
    const result = getDirname(import.meta.url);
    expect(result.includes('packages/file-utility/src')).toBe(true);
  });
});
