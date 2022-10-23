/**
 * For jest `ESM` resover, but now use vitest.
 * @param path
 * @param options
 * @returns
 */
const mjsResolver = (path, options) => {
  const esmExtRegex = /\.m?js$/i;
  const resolver = options.defaultResolver;
  if (esmExtRegex.test(path)) {
    try {
      return resolver(
        path.replace(/\.mjs$/, '.mts').replace(/\.js$/, '.ts'),
        options
      );
    } catch {
      // use default resolver
    }
  }
  return resolver(path, options);
};

module.exports = mjsResolver;
