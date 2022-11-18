/**
 * Retrieve translations on server-side, wraps next-i18next.serverSideTranslations
 * to allow further customizations.
 */
import { array } from '@dimjs/utils';
import type { SSRConfig, UserConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from '../../../next-i18next.config';
import type { I18nNamespace } from './i18n-namespace.types';

export async function getServerSideTranslations<
  NamespacesUnion extends I18nNamespace
>(
  locale: string,
  namespacesRequired?: Readonly<Extract<I18nNamespace, NamespacesUnion>[]>,
  configOverride?: UserConfig | null
): Promise<SSRConfig> {
  const override = configOverride ?? nextI18nextConfig;
  const i18nBaseNs: I18nNamespace[] = ['common', 'components'];
  const currI18nNs = i18nBaseNs.concat(
    namespacesRequired ? namespacesRequired?.slice() : []
  );
  // Slice needed here cause serverSlideTranslations does not accept Readonly type
  return serverSideTranslations(
    locale,
    array.arrayUnique(currI18nNs),
    override
  );
}
