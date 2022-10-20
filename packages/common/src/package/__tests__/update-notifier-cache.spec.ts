import { vi } from 'vitest';
import {
  createConfigDir,
  getLastUpdate,
  saveLastUpdate,
} from '../update-notifier/cache.js';

describe('UpdateNotifier cache', () => {
  beforeAll(() => {
    createConfigDir();
    vi.useFakeTimers().setSystemTime(new Date('2022-01-01'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('can save update then get the update details', () => {
    const fakeTime = new Date('2022-01-01').getTime();
    saveLastUpdate('test');
    expect(getLastUpdate('test')).toBe(fakeTime);
  });
});
