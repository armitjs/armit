import 'next';
import type { GetStaticPropsResult, GetServerSidePropsResult } from 'next';
import type { SSRConfig } from 'next-i18next';

declare module 'next' {
  export type PagePropsResultBaseData = SSRConfig & {
    /**
     * 当前的locale, 目前考虑一个locale对应一个channel,
     * @type AllSupportedLocaleType
     */
    locale: string;
    /**
     * 当前网站的所有系统配置
     */
    settings: Array<{
      /** Place our settings */
    }>;
    /**
     * 导航栏目的catalogs
     */
    catalogs: Array<{
      /** lace our settings */
    }>;
    /**
     * Footer 链接.
     */
    footerTopicLinks: Array<{
      /** lace our settings */
    }>;
  };

  export type GetStaticPagePropsResult<T extends PagePropsResultBaseData> =
    GetStaticPropsResult<T>;

  export type GetServerSidePagePropsResult<T extends PagePropsResultBaseData> =
    GetServerSidePropsResult<T>;
}
