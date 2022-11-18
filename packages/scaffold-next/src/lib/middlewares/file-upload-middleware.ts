import multiparty from 'multiparty';

/**
 * Express middleware is not built around promises but callbacks. This prevents it from playing well in the next-connect model.
 * Understanding the way express middleware works, we can build a wrapper like the below:
 * https://github.com/hoangvvo/next-connect#expressjs-compatibility
 */
export const fileUploadMiddleware = (req, res, next) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) {
      // has error here.
      return next(err);
    }
    req.body = fields;
    req.files = files;
    next();
  });
};
