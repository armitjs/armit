import type { NextApiResponse, NextApiRequest } from 'next';

/**
 * https://beta.nextjs.org/docs/data-fetching/api-routes
 * /api/getProduct
 * @param req
 * @param res
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: 'getProduct' });
}
