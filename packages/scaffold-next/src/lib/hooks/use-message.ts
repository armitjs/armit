import { useToast } from '@kzfoo/core';
import type { ErrorData } from '@kzfoo/service';
import { FetcherError } from '@kzfoo/service';
import { captureException } from '@sentry/nextjs';
import { hooks } from '@wove/react';
import { useTranslation } from 'next-i18next';

export type I18nErrorMessageDataInput =
  | null
  | string
  | FetcherError
  | Error
  | ErrorData;

export type I18nSuccMessageDataInput =
  | null
  | string
  | { code: string; message: string };

export type I18nInfoMessageDataInput =
  | null
  | string
  | { code: string; message: string };

const transformI18nInfoMessage = (
  translator: (path?: string) => string,
  data?: I18nInfoMessageDataInput
) => {
  if (data) {
    let infoCode;
    let infoMsg;
    if (typeof data === 'string') {
      // 如果为字符串, 直接使用当前字符串值显示(外部使用i18n.t(``))
      // infoCode = data;
      infoMsg = data;
    } else if (typeof data === 'object') {
      infoCode = data['code'];
      infoMsg = data['message'];
    }
    const i18nInfoMsg = infoCode ? translator(infoCode) : '';
    return i18nInfoMsg || infoMsg || data;
  }
  return null;
};

const transformI18nErrorMessage = (
  translator: (path?: string) => string,
  err?: I18nErrorMessageDataInput
) => {
  if (err) {
    let errCode;
    let errMsg;
    if (typeof err === 'string') {
      // 如果为字符串, 直接使用当前字符串值显示(外部使用i18n.t(``))
      // errCode = err;
      errMsg = err;
    } else if (err instanceof FetcherError) {
      errMsg = err.errors[0]?.message || err.message;
      errCode = err.errors[0]?.code;
    } else if (err instanceof Error) {
      errMsg = err.message;
    } else if (typeof err === 'object') {
      errCode = err['code'];
      errMsg = err['message'];
    }
    const i18nErrMsg = errCode ? translator(errCode) : '';
    return i18nErrMsg || errMsg || null;
  }
  return null;
};

const transformI18nSuccMessage = (
  translator: (path?: string) => string,
  data?: I18nSuccMessageDataInput
) => {
  if (data) {
    let succCode;
    let succMsg;

    if (typeof data === 'string') {
      // 如果为字符串, 直接使用当前字符串值显示(外部使用i18n.t(``))
      // succCode = data;
      succMsg = data;
    } else if (typeof data === 'object') {
      succCode = data['code'];
      succMsg = data['message'];
    }
    const i18nSuccMsg = succCode ? translator(succCode) : '';
    return i18nSuccMsg || succMsg || data;
  }
  return null;
};

/**
 * 通过`toast.pushSuccess`弹出经过i18n-next `common`.succResult中定义的国际化消息内容
 * 当传入的`data`为字符串的时候, 直接显示该字符串, 如果需要i8next转化可传入{code: string; message: string}
 * @returns
 */
export const useSuccMessage = (): [
  (data?: I18nSuccMessageDataInput) => void
] => {
  const toast = useToast();
  const getSuccMessages = useCommonMessages('succResult');
  const setSuccFn = hooks.useCallbackRef((data?: I18nSuccMessageDataInput) => {
    const sucMsg = transformI18nSuccMessage(getSuccMessages, data);
    if (sucMsg) {
      toast.pushSuccess(sucMsg, 2500);
    }
  });
  return [setSuccFn];
};
/**
 * 通过`toast.pushInfo`弹出经过i18n-next `common`.infoResult中定义的国际化消息内容
 * 当传入的`data`为字符串的时候, 直接显示该字符串, 如果需要i8next转化可传入{code: string; message: string}
 * @returns
 */
export const useInfoMessage = (): [
  (data?: I18nInfoMessageDataInput) => void
] => {
  const toast = useToast();
  const getInfoMessages = useCommonMessages('infoResult');
  const setInfoFn = hooks.useCallbackRef((data?: I18nInfoMessageDataInput) => {
    const infoMsg = transformI18nInfoMessage(getInfoMessages, data);
    if (infoMsg) {
      toast.pushInfo(infoMsg, 2500);
    }
  });
  return [setInfoFn];
};

/**
 * 通过`toast.pushError`弹出经过i18next `common`.errorResult中定义的国际化消息内容
 * @returns
 */
export const useErrorMessage = (): [
  (err?: I18nErrorMessageDataInput) => void
] => {
  const toast = useToast();
  const getErrorMessages = useCommonMessages('errorResult');
  const setErrorFn = hooks.useCallbackRef((err?: I18nErrorMessageDataInput) => {
    if (err) {
      // FIXME: Sentry 捕获所有的异常消息, 是否需要增加exception上下文.
      captureException(err);
    }
    const errMsg = transformI18nErrorMessage(getErrorMessages, err);
    if (errMsg) {
      toast.pushError(errMsg, 3500);
    }
  });
  return [setErrorFn];
};

/**
 * 返回经过i18next `common`.errorResult中定义的国际化消息内容
 * @returns
 */
export const useErrorResultTranslation = (): [
  (err?: I18nErrorMessageDataInput) => string | null
] => {
  const getErrorMessages = useCommonMessages('errorResult');
  const translationFn = hooks.useCallbackRef(
    (err?: I18nErrorMessageDataInput) => {
      return transformI18nErrorMessage(getErrorMessages, err);
    }
  );
  return [translationFn];
};

/**
 * next-i18next 默认必须要defaultNS:'common',
 * @param node 'common'
 * @returns
 */
export function useCommonMessages(
  node: 'infoResult' | 'succResult' | 'errorResult'
) {
  const { t, i18n } = useTranslation();
  return (path?: string) => {
    // 如果不传递path, 则直接忽略比如error.code不存在很正常.
    if (!path) {
      return null;
    }
    // `errorResult.INVALID_CREDENTIALS_ERROR`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const realPath = `${node}.${path}` as any;
    if (i18n.exists(realPath)) {
      return t(realPath);
    } else {
      console.warn(`The i18n resouce defined path "${realPath}"`);
    }
    return null;
  };
}
