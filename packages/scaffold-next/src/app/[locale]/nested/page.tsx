import { useTranslations } from 'next-intl';
import PageLayout from '@/components/PageLayout';

export default function Nested() {
  const t = useTranslations('Nested');

  return (
    <PageLayout title={t('title')}>
      <p>{t('description')}</p>
    </PageLayout>
  );
}
