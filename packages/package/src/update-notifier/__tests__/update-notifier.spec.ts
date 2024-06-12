import { vi } from 'vitest';
import { hasNewVersion } from '../has-new-version.js';
import { updateNotifier } from '../index.js';

describe('UpdateNotifier', () => {
  const consoleSpy = vi.spyOn(console, 'log');
  vi.mock('../has-new-version.js', () => {
    return {
      hasNewVersion: vi.fn(),
    };
  });

  afterEach(() => {
    consoleSpy.mockReset();
  });

  it('logs message if update is available', async () => {
    vi.mocked(hasNewVersion).mockResolvedValueOnce('2.0.0');

    await updateNotifier({
      pkg: { name: 'test', version: '1.0.0' },
      alwaysRun: true,
    });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('does not log message if update is not available', async () => {
    vi.mocked(hasNewVersion).mockResolvedValue(false);
    await updateNotifier({
      pkg: { name: 'test', version: '2.0.0' },
      alwaysRun: true,
    });
    expect(consoleSpy).toHaveBeenCalledTimes(0);
  });
});
