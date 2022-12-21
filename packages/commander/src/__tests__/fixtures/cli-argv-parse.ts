import { LogLevel } from '@armit/logger';
import { parseArgv } from '../../parse-argv.js';
console.log('LogLevel:', LogLevel);

const parsed = await parseArgv();

console.log(parsed);
