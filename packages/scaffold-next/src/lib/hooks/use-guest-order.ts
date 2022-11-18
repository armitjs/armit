import { array } from '@dimjs/utils';
import { cookie } from '@kzfoo/core';
const key = 'guest-order';

/**
 * 从cookie获取guest订单code列表
 * @param code
 * @returns
 */
const getGuestOrder = (): string[] => {
  const val = cookie.get(key);
  return val ? JSON.parse(val) : [];
};

/**
 * 保存guest订单code 到cookie
 * @param code
 * @returns
 */
const saveGuestOrder = (code: string): string[] => {
  const codes = getGuestOrder();
  const newCodes = code ? codes.concat(code) : codes;
  cookie.set(key, JSON.stringify(array.arrayUnique(newCodes)), {
    // Create a cookie that expires 2d
    expires: 2,
  });
  return newCodes;
};

export const useGuestOrder = () => {
  return {
    getGuestOrder,
    saveGuestOrder,
  };
};
