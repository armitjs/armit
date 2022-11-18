import { loadingKeys, models, useApiInput } from '@kzfoo/core';
import type {
  ID,
  NextCanReviewProductVariantQueryVariables,
} from '@kzfoo/service';
import { hooks, loading } from '@wove/react';
import { useEffect } from 'react';

export function useVariantCanBeReview({
  variantId,
  orderLineId,
}: {
  variantId?: ID;
  orderLineId?: ID;
}) {
  const canReviewApiInput =
    useApiInput<NextCanReviewProductVariantQueryVariables>();
  const [reviewState, reviewActions] = models.useStore('productReviewModel');

  const checkCanReviewThisProduct = hooks.useDebounceCallback(
    (variantId, orderLineId) => {
      void reviewActions.canReviewProductVariant(
        canReviewApiInput({
          productVariantId: variantId,
          orderLineId,
        })
      );
    }
  );

  useEffect(() => {
    if (variantId) {
      checkCanReviewThisProduct(variantId, orderLineId);
    }
  }, [checkCanReviewThisProduct, variantId]);

  const isChecking = loading.useLoading(
    loadingKeys.productReview.canReviewProductVariant
  );

  const canReview = variantId
    ? reviewState.lastedCanReviewProductVariants[variantId]
    : undefined;

  return {
    canReview,
    isChecking,
  };
}
