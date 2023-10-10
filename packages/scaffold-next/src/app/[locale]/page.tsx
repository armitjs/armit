import type { Metadata } from 'next';
import Image from 'next/image';
import { useFormatter, useNow, useTimeZone, useTranslations } from 'next-intl';
import {
  getFormatter,
  getNow,
  getTimeZone,
  getTranslator,
} from 'next-intl/server';
import { type ReactNode } from 'react';
import iconImage from '@/public/icon.png';
import MessagesAsPropsCounter from '../../components/client/01-MessagesAsPropsCounter';
import MessagesOnClientCounter from '../../components/client/02-MessagesOnClientCounter';
import ClientRouterWithoutProvider from '../../components/ClientRouterWithoutProvider';
import CoreLibrary from '../../components/CoreLibrary';
import LocaleSwitcher from '../../components/LocaleSwitcher';
import PageLayout from '../../components/PageLayout';
import { Link } from '../../navigation';
import styles from './page.module.css';

type Props = {
  children: ReactNode;
  params: { locale: string };
};
export async function generateMetadata({
  params: { locale },
}: Omit<Props, 'children'>): Promise<Metadata> {
  const t = await getTranslator(locale, 'LocaleLayout');
  const formatter = await getFormatter(locale);
  const now = await getNow(locale);
  const timeZone = await getTimeZone(locale);

  return {
    title: t('title'),
    description: t('description'),
    other: {
      currentYear: formatter.dateTime(now, { year: 'numeric' }),
      timeZone: timeZone || 'N/A',
    },
  };
}
type PageProps = {
  searchParams: Record<string, string>;
};

export default function Index({ searchParams }: PageProps) {
  const t = useTranslations('Index');
  const format = useFormatter();
  const now = useNow();
  const timeZone = useTimeZone();

  return (
    <PageLayout title={t('title')}>
      <div className={styles.main}></div>
      <p className={styles.title}>{t('description')}</p>
      <p data-testid="RichText">
        {t.rich('rich', { important: (chunks) => <b>{chunks}</b> })}
      </p>
      <p
        dangerouslySetInnerHTML={{ __html: t.raw('rich') }}
        data-testid="RawText"
      />
      <p data-testid="GlobalDefaults">{t.rich('globalDefaults')}</p>
      {/* @ts-expect-error Purposefully trigger an error */}
      <p data-testid="MissingMessage">{t('missing')}</p>
      <p data-testid="CurrentTime">
        {format.dateTime(now, 'medium')} ({timeZone || 'N/A'})
      </p>
      <p data-testid="CurrentTimeRelative">{format.relativeTime(now)}</p>
      <p data-testid="Number">
        {format.number(23102, { style: 'currency', currency: 'EUR' })}
      </p>
      <LocaleSwitcher />
      <MessagesAsPropsCounter />
      <MessagesOnClientCounter />
      <CoreLibrary />
      <ClientRouterWithoutProvider />
      <div>
        <Link href={{ pathname: '/', query: { test: true } }}>
          Go to home with query param
        </Link>
      </div>
      <p data-testid="SearchParams">{JSON.stringify(searchParams, null, 2)}</p>
      <Image alt="" height={77} priority src={iconImage} width={128} />
    </PageLayout>
  );
}
