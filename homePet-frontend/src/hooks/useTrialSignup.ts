import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAppDispatch } from '#/store/hooks';
import { applyLoginContext, applyMeContext } from '#/store/auth/applyAuthContext';
import { useTrialSignupMutation } from '#/store/billing/billingApi';
import type { TrialSignupRequest } from '#/store/billing/billing.types';
import { getApiErrorMessage } from '#/lib/apiError';
import { useLazyMeQuery } from '#/store/auth/authApi';
import { clearClientSessionData, performFullLogout } from '#/store/auth/auth.actions';

export function useTrialSignup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [trialSignup, { isLoading }] = useTrialSignupMutation();
  const [triggerMe] = useLazyMeQuery();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(
    async (payload: TrialSignupRequest) => {
      setError(null);
      setFieldErrors({});
      setIsSubmitting(true);
      try {
        const data = await trialSignup(payload).unwrap();
        clearClientSessionData();
        performFullLogout(dispatch);
        applyLoginContext(dispatch, data);
        const me = await triggerMe().unwrap();
        applyMeContext(dispatch, me);
        if (import.meta.env.DEV) {
          console.log('Tenant activo:', me.usuario.id_veterinaria);
        }
        navigate({ to: '/dashboard' });
      } catch (err) {
        const apiData = (err as { data?: unknown })?.data;
        if (apiData && typeof apiData === 'object') {
          const record = apiData as Record<string, unknown>;
          const nextFieldErrors: Record<string, string[]> = {};
          Object.entries(record).forEach(([key, value]) => {
            if (key !== 'detail' && Array.isArray(value)) {
              nextFieldErrors[key] = value
                .filter((item): item is string => typeof item === 'string');
            }
          });
          setFieldErrors(nextFieldErrors);
        }
        setError(getApiErrorMessage(err, 'No se pudo crear la cuenta trial.'));
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, navigate, trialSignup, triggerMe],
  );

  return useMemo(
    () => ({ submit, isLoading: isLoading || isSubmitting, error, fieldErrors }),
    [submit, isLoading, isSubmitting, error, fieldErrors],
  );
}
