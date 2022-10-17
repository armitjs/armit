import { join } from 'path';
import { readJsonFromFile } from '../../file/file-write.js';
import { runCliMock } from './cmd-util.js';

describe('cli basic infrusture', () => {
  const packagePath = join(process.cwd(), './package.json');

  it('Should output correct `version` -v', async () => {
    const { stdout } = await runCliMock('-v');
    const pkgJson = readJsonFromFile<{ version: string }>(packagePath);
    expect(stdout).toStrictEqual(expect.stringContaining(pkgJson.version));
  });

  it('Should output correct `help` -h', async () => {
    const { stdout } = await runCliMock('-h');
    expect(stdout).toStrictEqual(
      expect.stringContaining(`Usage: cli-boot.ts <command> [options]`)
    );
    expect(stdout).toStrictEqual(expect.stringContaining(`Commands:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`cli-boot.ts test`));
    expect(stdout).toStrictEqual(expect.stringContaining(`Globals:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-h, --help`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-v, --version`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-l, --logLevel`));
    expect(stdout).toStrictEqual(
      expect.stringContaining(`Copyright 2022 @armit`)
    );
  });
  it('Should output correct `test help` -h', async () => {
    const { stdout } = await runCliMock('test', '-h');
    expect(stdout).toStrictEqual(expect.stringContaining(`cli-boot.ts test`));
    expect(stdout).toStrictEqual(expect.stringContaining(`Globals:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-h, --help`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-v, --version`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-l, --logLevel`));
    expect(stdout).toStrictEqual(expect.stringContaining(`Options:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-t, --test`));
    expect(stdout).toStrictEqual(expect.stringContaining(`test describe`));
    expect(stdout).toStrictEqual(expect.stringContaining(`[default: true]`));
  });

  it('The output should be run handler()', async () => {
    const { stdout } = await runCliMock('test');
    expect(stdout).toStrictEqual(
      expect.stringContaining('this is test command handle')
    );
  });

  it('The output should have correct global options', async () => {
    const { stdout } = await runCliMock('test', '-l=Debug');
    expect(stdout).toStrictEqual(
      expect.stringContaining('this is debug message for test command')
    );
    expect(stdout).toStrictEqual(expect.stringContaining('DEBUG'));
  });

  it('The output should have correct handle wrong param input', async () => {
    const { stderr } = await runCliMock('test', '-l=Wrong');
    expect(stderr).toStrictEqual(
      expect.stringContaining('Error: Invalid values:')
    );
    expect(stderr).toStrictEqual(
      expect.stringContaining(
        `Given: "Wrong", Choices: "Error", "Warn", "Info", "Verbose", "Debug"`
      )
    );
  });
});
