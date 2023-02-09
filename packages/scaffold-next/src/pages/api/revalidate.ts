import { join } from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiRouter } from '@/lib/middlewares';
// import nextI18nextConfig from '../../../next-i18next.config';

async function revalidateHandler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  if (req.headers['x-next-purge-token'] !== process.env.PURGE_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const body = await getRawBody(req);
  if (!body) {
    res.status(400).send('Bad request (no body)');
    return;
  }

  const revalidate = async (locale: string, issuePath: string) => {
    const revalidatePath = join(`/${locale}`, issuePath);
    if (process.env.NODE_ENV === 'development') {
      console.log('revalidate path', revalidatePath);
    }
    // This should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    await res.revalidate(revalidatePath);
  };

  try {
    const jsonBody = JSON.parse(body);
    const issuePath = jsonBody['issue'];
    const locale = jsonBody['locale'];

    if (issuePath) {
      const locales = ['en', 'de']; // nextI18nextConfig.i18n.locales;
      if (locales.includes(locale)) {
        await revalidate(locale, issuePath);
      } else {
        for (const curLocale of locales) {
          await revalidate(curLocale, issuePath);
        }
      }
    }
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}

function getRawBody(req: NextApiRequest) {
  return new Promise<string>((resolve, reject) => {
    const bodyChunks: Buffer[] = [];
    req.on('end', () => {
      const rawBody = Buffer.concat(bodyChunks).toString('utf8');
      resolve(rawBody);
    });
    req.on('data', (chunk) => bodyChunks.push(chunk));
    req.on('error', (err) => reject(err));
  });
}

export default createApiRouter(revalidateHandler);

export const config = {
  api: {
    bodyParser: false,
  },
};
