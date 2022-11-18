import { loadingKeys, models, useApiInput } from '@kzfoo/core';
import { hooks, loading } from '@wove/react';

export const useLogout = (callback?: () => void | Promise<void>) => {
  const [, customerActions] = models.useStore('customerModel');
  const [, cartActions] = models.useStore('cartModel');
  const [, actions] = models.useStore('authModel');
  const [, campaignActions] = models.useStore('campaignModel');
  const [, checkoutActions] = models.useStore('checkoutModel');
  const [, reviewActions] = models.useStore('productReviewModel');
  const [, accountOrderAction] = models.useStore('accountOrderModel');
  const [, tryonActions] = models.useStore('tryonModel');
  const [, rxActions] = models.useStore('rxModel');

  const apiInput = useApiInput();
  const onLogout = hooks.useCallbackRef(() => {
    return actions.logout(apiInput()).then(() => {
      void customerActions.emptyCustomer();
      void cartActions.emptyCartView();
      void campaignActions.emptyCampaign();
      void checkoutActions.emptyCheckout();
      void reviewActions.emptyProductReviewModel();
      void accountOrderAction.emptyAccountOrder();
      void tryonActions.emptyTryonFaceModels();
      void rxActions.emptyRxModel();
      if (callback) {
        callback();
      }
    });
  });

  const logoutLoading = loading.useLoading(loadingKeys.auth.logout);

  return {
    logoutLoading,
    onLogout,
  };
};
