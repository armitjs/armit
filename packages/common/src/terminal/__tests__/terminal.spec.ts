import { Terminal, advancedLevels } from '../index.js';

describe('new Terminal()', () => {
  let mockStdout;
  let mockStderr;
  beforeAll(() => {
    mockStdout = vi.spyOn(process.stdout, 'write');
    mockStderr = vi.spyOn(process.stderr, 'write');
  });

  afterAll(() => {
    mockStdout.mockRestore();
    mockStderr.mockRestore();
  });

  it('should correct print log message', () => {
    const terminal = new Terminal({
      levels: advancedLevels,
    });
    terminal.log.trace('Initial log.');
    terminal.log.error('Something happened.');
    expect(mockStdout).toHaveBeenCalledWith(
      expect.stringMatching('Initial log.')
    );
    expect(mockStderr).toHaveBeenCalledWith(
      expect.stringMatching('Something happened.')
    );
  });

  it('should correct work for multi instance of Terminal', () => {
    const t1 = new Terminal({
      levels: advancedLevels,
    });

    const t2 = new Terminal({
      levels: advancedLevels,
      showDate: true,
      showLevelName: true,
      showTimestampRelativeToLastLog: false,
      use24HourClock: true,
    });

    const t3 = new Terminal({
      levels: advancedLevels,
      showArrow: true,
      showRelativeTimestamp: true,
      showTimestamp: false,
    });

    t1.log.warn('The t1 fox is coming...');
    t2.log.warn('The t2 fox is coming...');
    t3.log.warn('The t3 fox is coming...');
  });

  it('should correct work creating custom levels ', () => {
    const terminal = new Terminal({
      showLevelName: true,

      levels: [
        ...advancedLevels,
        {
          color: ['bgGreen', 'white', 'bold'],
          isError: false,
          name: 'victory',
        },
        {
          color: ['cyan', 'bold', 'underline'],
          isError: false,
          name: 'weather',
        },
      ],
    });

    terminal.log.weather('Today will be 280°C (about the same as an oven).');
    terminal.log.victory('The octopus has won.');
  });

  it('should correct display context ', () => {
    const terminal = new Terminal({
      levels: [...advancedLevels],
      showLevelName: true,
      showRelativeTimestamp: false,
      showTimestampRelativeToLastLog: false,
    });
    terminal.log.trace('The octopus has won.', 'context');
    expect(mockStdout).toHaveBeenCalledWith(expect.stringMatching('CONTEXT'));

    terminal.log.error(
      'Today will be 280°C (about the same as an oven).',
      'Context'
    );
    terminal.log.error(
      'The octopus has error with stack',
      'Context',
      new Error('error').stack
    );
    expect(mockStderr).toHaveBeenCalledWith(expect.stringMatching('CONTEXT'));
    expect(mockStderr).toHaveBeenCalledWith(
      expect.stringMatching('Error: error')
    );
  });
});
