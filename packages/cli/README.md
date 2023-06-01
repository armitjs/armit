# @armit/cli

A tool the modern for rapidly building command line armitjs apps

## Install globally

- `npm i -g @armit/cli`

## Module/Programmatic Usage

- `yarn add @armit/cli`

Add this package to package dependencies linked to your app, just import them like regular packages:

```typescript
import { bootstrap } from "@armit/cli";

bootstrap().then((cli) => {
  // Register customized plugins chain.
  cli.register(pluginA).register(pluginB);

  // Parse progress arguments.
  cli.parse(process.argv.slice(2));
});
```

## Create a custom armitjs-based plugin chain e.g. `arm test`

- armit-cli-plugin-`test`/package.json
  ```json
  "type": "module",
  "exports": {
    ".": {
      "import": "./index.js"
    },
    "./package.json": "./package.json"
  },
  ```
- armit-cli-plugin-`test`/src/index.ts

```ts
import type { CommandArgv } from "@armit/commander";
import { AbstractHandler, createCommand } from "@armit/commander";

type TestCmdArgs = CommandArgv<{
  test: number;
}>;

class CmdTestHandle extends AbstractHandler<TestCmdArgs> {
  handle(): void | Promise<void> {
    console.log("this is test command handle");
    this.logger.debug("this is debug message for test command");
  }
}

const cmdTest = createCommand(
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

// As named export `cmdtest`
export const myPlugin = definePlugin({
  name:'cmdtest',
  commandModule: cmdTest;
});

//  As named export `cmdtest2`
export const myPlugin = definePlugin({
  name:'cmdtest2',
  commandModule: cmdTest;
});
```

## Contributing

Contributions are happily accepted. I respond to all PR's and can offer guidance on where to make changes. For contributing tips see CONTRIBUTING.md
