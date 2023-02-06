import { useTranslations } from 'next-intl';
import LocaleSwitcher from '@/components/locale-switcher';
import PageLayout from '@/components/page-layout';
import styles from './page.module.css';

export default function Index() {
  const t = useTranslations('Index');

  return (
    <PageLayout title={t('title')}>
      <p className={styles.title}>{t('description')}</p>
      <LocaleSwitcher />
    </PageLayout>
  );
}
