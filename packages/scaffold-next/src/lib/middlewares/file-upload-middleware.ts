import multiparty from 'multiparty';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Express middleware is not built around promises but callbacks. This prevents it from playing well in the next-connect model.
 * Understanding the way express middleware works, we can build a wrapper like the below:
 * https://github.com/hoangvvo/next-connect#expressjs-compatibility
 */
export const fileUploadMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (err?: unknown) => void
) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) {
      // has error here.
      return next(err);
    }
    req.body = fields;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any)['files'] = files;
    next();
  });
};
