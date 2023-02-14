import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageLayout from '../../../components/PageLayout';

export async function generateMetadata(): Promise<Metadata> {
  // const product = await getProduct(params.id);
  const t = await getTranslations('Product');
  return { title: t('title'), description: t('description') };
}

export default function Index() {
  const t = useTranslations('Product');
  return (
    <PageLayout title={t('title')}>
      <p>{t('description')}</p>
    </PageLayout>
  );
}
