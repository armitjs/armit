import { rmSync } from 'node:fs';
import { vi } from 'vitest';
import {
  createConfigDir,
  getConfigFile,
  getLastUpdate,
  saveLastUpdate,
} from '../cache.js';

describe('UpdateNotifier cache', () => {
  beforeAll(() => {
    createConfigDir();
    vi.useFakeTimers().setSystemTime(new Date('2022-01-01'));
  });

  afterAll(() => {
    vi.useRealTimers();
    ['test', '@armit-test/test'].forEach((packageName) => {
      rmSync(getConfigFile(packageName));
    });
  });

  it('can save update then get the update details', () => {
    const fakeTime = new Date('2022-01-01').getTime();
    saveLastUpdate('test');
    expect(getLastUpdate('test')).toBe(fakeTime);
  });

  it('should support scoped package update then get update details', () => {
    const fakeTime = new Date('2022-01-01').getTime();
    saveLastUpdate('@armit-test/test');
    expect(getLastUpdate('@armit-test/test')).toBe(fakeTime);
  });
});
