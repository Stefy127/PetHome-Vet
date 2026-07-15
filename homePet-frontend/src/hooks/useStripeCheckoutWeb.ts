import { useCallback, useMemo, useState } from 'react';

export function useStripeCheckoutWeb() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCheckout = useCallback(async (checkoutUrl?: string) => {
    setError(null);
    setIsLoading(true);
    try {
      if (!checkoutUrl) {
        setError('El backend no devolvio checkout_url para iniciar el pago.');
        return;
      }

      window.location.assign(checkoutUrl);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      startCheckout,
      isLoading,
      error,
    }),
    [startCheckout, isLoading, error],
  );
}
