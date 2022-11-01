import { DefaultLogger, LogLevel } from '@armit/common';

describe('displayError', () => {
  const logger = new DefaultLogger({
    level: LogLevel.Warn,
    noColor: true,
  });

  logger.setDefaultContext('generate-template-files');

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
