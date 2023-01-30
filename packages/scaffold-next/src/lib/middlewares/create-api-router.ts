import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { createRouter, expressWrapper } from 'next-connect';
import { normalizeVendureApiErrorToClient } from './errors';
import { fileUploadMiddleware } from './file-upload-middleware';

/**
 * https://github.com/hoangvvo/next-connect#expressjs-compatibility
 * 提供统一经过sentry 异常处理的ApiRouterWrapper, Note Express middleware is not built around promises but callbacks.
 * This prevents it from playing well in the next-connect model. `import { expressWrapper } from "next-connect";`
 * @param apiHandler
 * @returns
 */
export const createApiRouter = (apiHandler: NextApiHandler) => {
  // Force all request is `POST`
  return createRouter<NextApiRequest, NextApiResponse>()
    .post(wrapApiHandlerWithSentry(apiHandler, ''))
    .handler({
      onError(err, req, res: NextApiResponse) {
        normalizeVendureApiErrorToClient(res, err);
      },
    });
};

/**
 * https://github.com/hoangvvo/next-connect#expressjs-compatibility
 * 提供统一经过sentry 异常处理的ApiRouterWrapper, 自带文件上传middleware 集成.
 * This prevents it from playing well in the next-connect model. `import { expressWrapper } from "next-connect";`
 * @param apiHandler
 * @returns
 */
export const createUploadApiRouter = (apiHandler: NextApiHandler) => {
  // Force all request is `POST`
  return createRouter<NextApiRequest, NextApiResponse>()
    .use(expressWrapper(fileUploadMiddleware))
    .post(wrapApiHandlerWithSentry(apiHandler, ''))
    .handler({
      onError(err, req, res: NextApiResponse) {
        normalizeVendureApiErrorToClient(res, err);
      },
    });
};
