import { mockConsoleLog } from 'jest-mock-process';
import { showBanner } from '../terminal-banner.js';

describe('cli banner', () => {
  let mockConsole;
  beforeAll(() => {
    mockConsole = mockConsoleLog();
  });
  afterAll(() => {
    mockConsole.mockRestore();
  });
  it('should correct print cli banner', () => {
    showBanner('armit', {
      align: 'left',
      gradient: 'red,blue',
    });
    expect(mockConsole).toHaveBeenCalledTimes(1);
    showBanner('A elegant small typescript based front-end dev-kits', {
      align: 'left',
      font: 'console',
      gradient: 'yellow,green',
    });
    expect(mockConsole).toHaveBeenCalledTimes(2);
  });
});
