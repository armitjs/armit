# @armit/common

A fast, generic utils for working with command, git, file, package, terminal, logger and etc based on armitjs.

## Module/Programmatic Usage

- `yarn add @armit/common`

Add this package to package dependencies linked to your app, just import them like regular packages:

```ts
import { AbstractHandler } from "@armit/common";

type TestCmdArgs = CommandArgv<{
  test: number;
}>;

class CmdTestHandle extends AbstractHandler<TestCmdArgs> {
  get name(): string {
    return `test`;
  }
  handle(): void | Promise<void> {
    console.log("this is test command handle");
    this.logger.debug("this is debug message for test command");
  }
}

export const cmdTest = createCommand(
  "test",
  {
    command: "test",
    describe: "Display armit project details.",
    builder: (yargs) => {
      return yargs.example(`$0 cmd test `, "cli testing").option("test", {
        type: "number",
        alias: "t",
        default: true,
        describe: `cli option test describe`,
      });
    },
  },
  CmdTestHandle
);
```
