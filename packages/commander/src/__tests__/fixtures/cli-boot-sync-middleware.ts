import { createCli } from "../../create-cli.js";
import { cmdTest } from "./cmd-test-builder.js";

createCli({
  group: "@armit",
  exitProcess: false,
})
  .setupMiddleware(
    [
      async (args) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            console.log("this is global async middleware");
            resolve();
          }, 1000);
        });
      },
    ],
    true
  )
  .register(cmdTest)
  .parseAsync(process.argv.slice(2));
