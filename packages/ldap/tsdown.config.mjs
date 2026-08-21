/** @type {import('tsdown').UserConfig} */
export default {
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  fixedExtension: false,
  tsconfig: './tsconfig.build.json',
  format: ['esm'],
};
