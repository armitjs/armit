import { isPathMatchRoute } from '../path';
describe('utils/path', () => {
  it('should path match correct', async () => {
    expect(isPathMatchRoute(`/account`, `/account?name=tian#/hash`)).toBe(true);
    expect(isPathMatchRoute(`/account`, `/account/?name=tian#/hash`)).toBe(
      false
    );
  });
});
