import { createCli } from "../../create-cli.js";
import { cmdTest } from "./cmd-test-builder.js";

createCli({
  group: "@armit",
  exitProcess: false,
})
  .setupMiddleware(
    [
      (args) => {
        console.log("this is global middleware");
      },
    ],
    true
  )
  .register(cmdTest)
  .parse(process.argv.slice(2));
