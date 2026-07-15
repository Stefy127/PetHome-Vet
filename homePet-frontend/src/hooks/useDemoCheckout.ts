import { useCallback, useMemo, useState } from 'react';
import {
  useCheckoutDemoConfirmMutation,
  useCheckoutDemoStartMutation,
} from '#/store/billing/billingApi';
import type { CheckoutDemoStartRequest } from '#/store/billing/billing.types';
import { getApiErrorMessage } from '#/lib/apiError';

const CHECKOUT_TOKEN_KEY = 'homePet_checkout_token';

export function useDemoCheckout() {
  const [startMutation, startState] = useCheckoutDemoStartMutation();
  const [confirmMutation, confirmState] = useCheckoutDemoConfirmMutation();
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(
    async (payload: CheckoutDemoStartRequest) => {
      setError(null);
      const data = await startMutation(payload).unwrap();
      if (data.checkout_token) {
        window.localStorage.setItem(CHECKOUT_TOKEN_KEY, data.checkout_token);
      }
      return data;
    },
    [startMutation],
  );

  const confirm = useCallback(async (checkoutToken?: string) => {
    setError(null);
    try {
      const token = checkoutToken || window.localStorage.getItem(CHECKOUT_TOKEN_KEY) || '';
      const data = await confirmMutation({ checkout_token: token }).unwrap();
      window.localStorage.removeItem(CHECKOUT_TOKEN_KEY);
      return data;
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo completar el checkout demo.'));
      throw err;
    }
  }, [confirmMutation]);

  return useMemo(
    () => ({
      start,
      confirm,
      isLoading: startState.isLoading || confirmState.isLoading,
      error,
    }),
    [start, confirm, startState.isLoading, confirmState.isLoading, error],
  );
}
