import { Link, useTranslations } from 'next-intl';
import MessagesAsPropsCounter from '../../components/client/01-MessagesAsPropsCounter';
import MessagesOnClientCounter from '../../components/client/02-MessagesOnClientCounter';
import ClientRouterWithoutProvider from '../../components/ClientRouterWithoutProvider';
import CoreLibrary from '../../components/CoreLibrary';
import CurrentTime from '../../components/CurrentTime';
import LocaleSwitcher from '../../components/LocaleSwitcher';
import PageLayout from '../../components/PageLayout';
import styles from './page.module.css';

// Output: <title>Acme</title>
// https://beta.nextjs.org/docs/api-reference/metadata
export const metadata = {
  // Default title is used from the layout
  description: 'ACME is a...',
};

export default function Index() {
  const t = useTranslations('Index');
  return (
    <PageLayout title={t('title')}>
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
      <CurrentTime />
      <LocaleSwitcher />
      <MessagesAsPropsCounter />
      {/* @ts-expect-error RSC are not supported yet by TypeScript */}
      <MessagesOnClientCounter />
      <CoreLibrary />
      <ClientRouterWithoutProvider />
      <div>
        <Link href={{ pathname: '/', query: { test: true } }}>
          Go to home with query param
        </Link>
      </div>
    </PageLayout>
  );
}
