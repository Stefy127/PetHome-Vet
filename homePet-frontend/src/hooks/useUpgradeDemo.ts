import { useCallback, useMemo, useState } from 'react';
import { useLazyMeQuery } from '#/store/auth/authApi';
import { useAppDispatch } from '#/store/hooks';
import { applyMeContext } from '#/store/auth/applyAuthContext';
import {
  useUpgradeDemoConfirmMutation,
  useUpgradeDemoStartMutation,
} from '#/store/billing/billingApi';
import { getApiErrorMessage } from '#/lib/apiError';

export function useUpgradeDemo() {
  const dispatch = useAppDispatch();
  const [triggerMe] = useLazyMeQuery();
  const [startMutation, startState] = useUpgradeDemoStartMutation();
  const [confirmMutation, confirmState] = useUpgradeDemoConfirmMutation();
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(
    async (plan_id: number) => {
      setError(null);
      return startMutation({ plan_id }).unwrap();
    },
    [startMutation],
  );

  const confirm = useCallback(async (checkout_token: string) => {
    setError(null);
    try {
      const data = await confirmMutation({ checkout_token }).unwrap();
      const me = await triggerMe().unwrap();
      applyMeContext(dispatch, me);
      return data;
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo completar el upgrade demo.'));
      throw err;
    }
  }, [confirmMutation, triggerMe, dispatch]);

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
