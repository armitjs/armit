import { vi } from 'vitest';
import { getLastUpdate } from '../cache.js';
import { getDistVersion } from '../get-dist-version.js';
import { hasNewVersion } from '../has-new-version.js';

describe('hasNewVersion', () => {
  vi.mock('../get-dist-version.js', () => {
    return {
      getDistVersion: vi.fn(),
    };
  });
  vi.mock('../cache.js', () => ({
    getLastUpdate: vi.fn().mockReturnValue(undefined),
    createConfigDir: vi.fn(),
    saveLastUpdate: vi.fn(),
  }));

  afterEach(() => {
    vi.clearAllMocks();
  });

  const pkg = { name: 'test', version: '1.0.0' };

  const defaultArgs = {
    pkg,
    shouldNotifyInNpmScript: true,
    alwaysRun: true,
  };

  test('it should not trigger update for same version', async () => {
    vi.mocked(getDistVersion).mockResolvedValue('1.0.0');
    const newVersion = await hasNewVersion(defaultArgs);
    expect(newVersion).toBe(false);
  });

  test('it should trigger update for patch version bump', async () => {
    vi.mocked(getDistVersion).mockResolvedValue('1.0.1');

    const newVersion = await hasNewVersion(defaultArgs);

    expect(newVersion).toBe('1.0.1');
  });

  test('it should trigger update for minor version bump', async () => {
    vi.mocked(getDistVersion).mockResolvedValue('1.1.0');

    const newVersion = await hasNewVersion(defaultArgs);

    expect(newVersion).toBe('1.1.0');
  });

  test('it should trigger update for major version bump', async () => {
    vi.mocked(getDistVersion).mockResolvedValue('2.0.0');

    const newVersion = await hasNewVersion(defaultArgs);

    expect(newVersion).toBe('2.0.0');
  });

  test('it should not trigger update if version is lower', async () => {
    vi.mocked(getDistVersion).mockResolvedValue('0.0.9');

    const newVersion = await hasNewVersion(defaultArgs);

    expect(newVersion).toBe(false);
  });

  it('should trigger update check if last update older than config', async () => {
    const TWO_WEEKS = new Date().getTime() - 1000 * 60 * 60 * 24 * 14;
    vi.mocked(getLastUpdate).mockReturnValue(TWO_WEEKS);
    const newVersion = await hasNewVersion({
      pkg,
      shouldNotifyInNpmScript: true,
    });

    expect(newVersion).toBe(false);
    expect(getDistVersion).toHaveBeenCalled();
  });

  it('should not trigger update check if last update is too recent', async () => {
    const TWELVE_HOURS = new Date().getTime() - 1000 * 60 * 60 * 12;
    vi.mocked(getLastUpdate).mockReturnValue(TWELVE_HOURS);
    const newVersion = await hasNewVersion({
      pkg,
      shouldNotifyInNpmScript: true,
    });

    expect(newVersion).toBe(false);
    expect(getDistVersion).not.toHaveBeenCalled();
  });
});
