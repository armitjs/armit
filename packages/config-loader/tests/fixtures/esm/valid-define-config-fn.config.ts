// it is `esm` module causeof package.json `type:module`
import { defineConfig } from '../../../src/define-config/define-config.js';

export default defineConfig<{ name: string }>(() => ({
  name: 'tian',
}));
