import { Logger } from '../core/logger.js';
import { StdoutAdapter } from '../node/stdout-adapter.js';
import { TerminalFormatStrategy } from '../node/terminal-format-strategy.js';
describe('Logger class constructor', () => {
  it('should correct new instance for Logger', () => {
    let logger = new Logger();
    expect(logger).toHaveProperty('printer');
    logger = new Logger({
      adapter: new StdoutAdapter(),
      formatStrategy: new TerminalFormatStrategy(),
    });
    expect(logger['printer']['logAdapters'][0].formatStrategy).instanceOf(
      TerminalFormatStrategy
    );
    logger = new Logger({
      adapter: new StdoutAdapter({
        formatStrategy: new TerminalFormatStrategy(),
      }),
    });
    expect(logger['printer']['logAdapters'][0].formatStrategy).instanceOf(
      TerminalFormatStrategy
    );
  });
});
