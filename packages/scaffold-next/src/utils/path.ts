/**
 * 返回当前路由的pathname 与当前URL地址的匹配是否为同一个pathname
 * @example
 * ```ts
 *  1. isPathMatchRoute(`/account`, `/account?name=tian#/hash`) ==> true
 *  2. isPathMatchRoute(`/account`, `/account/?name=tian#/hash`) ==> false
 * ```
 * @param asPath useRouter().asPath `/account`
 * @param href `/account?name=tian#/hash`
 * @returns
 */
export const isPathMatchRoute = (asPath: string, href: string) => {
  const pathNameRegexp = /[^?#]*/;
  const asPathName = pathNameRegexp.exec(asPath);
  const hrefPathName = pathNameRegexp.exec(href);
  if (!asPathName || !hrefPathName) {
    return false;
  }
  return asPathName[0] === hrefPathName[0];
};
