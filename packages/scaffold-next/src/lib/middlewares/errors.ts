import type { NextApiResponse } from 'next';

export class ServerApiError extends Error {
  res: Response;
  status: number;
  code?: string;
  constructor(
    res: Response,
    message?: string,
    code?: string,
    statusCode = 400
  ) {
    super(message);
    this.name = 'ServerApiError';
    this.res = res;
    this.code = code;
    this.status = this.isOk(res) ? statusCode : res.status;
  }
  /**
   * Make sure that ServerApiError always should have error statusCode to client.
   * if isOk(), always return 400, otherwise keep source error status code. e.g. 401, 500.
   * @param res
   * @returns
   */
  private isOk(res: Response) {
    return res.status >= 200 && res.status < 300;
  }
}

export class VendureNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VendureNetworkError';
  }
}

/**
 * 将标准符合常规预期的错误`ServerApiError`包装为统一的客户端fetcher(`FetcherError`)格式返回客户端.
 * @param nextApiResponse
 * @param error
 * @returns
 */
export const normalizeVendureApiErrorToClient = (
  nextApiResponse: NextApiResponse,
  error: unknown
) => {
  if (error instanceof ServerApiError) {
    // 直接返回错误API JSON结果到客户端XHR fetcher; `FetcherError`
    return nextApiResponse.status(error.status || 400).json({
      data: null,
      errors: [
        {
          message: error.message,
          code: error.code,
        },
      ],
    });
  } else {
    // 当handler未预期的错误发生(未被 `VendureApiError`异常所拦截的情况); 使用一个简单的兜底异常normalize.
    // 此异常会再次被`normalizeUnExpectedHandleError(error)`兜底处理.
    return nextApiResponse.status(500).json({
      data: null,
      errors: [{ message: error instanceof Error ? error.message : 'unknown' }],
    });
  }
};
