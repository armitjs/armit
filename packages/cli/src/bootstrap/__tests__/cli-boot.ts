import { bootstrap } from '../index.js';

bootstrap().then((cli) => {
  cli.parse(process.argv.slice(2));
});
