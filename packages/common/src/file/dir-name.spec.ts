import { getDirname } from './dir-name.js';

describe('dir-name.mts', () => {
  it('should correct dynamic determined __dirname', () => {
    const result = getDirname(import.meta.url);
    expect(result.includes('packages/helpers/src')).toBe(true);
  });
});
