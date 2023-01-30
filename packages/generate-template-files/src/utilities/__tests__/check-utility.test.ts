import { Logger, LogLevel } from '@armit/logger';
import { StdoutAdapter, TerminalFormatStrategy } from '@armit/logger/node';

describe('displayError', () => {
  const logger = new Logger({
    logLevel: LogLevel.Warn,
    noColor: true,
    context: 'generate-template-files',
    adapter: new StdoutAdapter({
      formatStrategy: new TerminalFormatStrategy(),
    }),
  });

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
  const errorString = 'Some error thrown for testing purposes';

  test('should throw an error if condition is false', () => {
    logger.error(errorString);
    expect(mockStderr).toHaveBeenCalledWith(expect.stringMatching(errorString));
    expect(mockStderr).toHaveBeenCalledWith(
      expect.stringMatching(`generate-template-files`.toUpperCase())
    );
  });
});
