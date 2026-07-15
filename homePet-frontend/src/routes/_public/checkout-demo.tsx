import { useEffect, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '#/components/ui/button';
import { useDemoCheckout } from '#/hooks/useDemoCheckout';

export const Route = createFileRoute('/_public/checkout-demo')({
  component: CheckoutDemoPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
});

function CheckoutDemoPage() {
  const navigate = useNavigate();
  const { confirm, isLoading, error } = useDemoCheckout();
  const { token } = Route.useSearch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  const onConfirm = async () => {
    await confirm(token);
    navigate({ to: '/login', search: { register: false } });
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center px-4 py-10">
      <div className="rounded-2xl bg-white p-8 text-slate-900">
        <h1 className="text-2xl font-bold">Checkout Demo</h1>
        <p className="mt-2 text-slate-600">Simulando pasarela de pago...</p>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-[#F97316] transition-all duration-1000" style={{ width: ready ? '100%' : '35%' }} />
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <Button disabled={!ready || isLoading} onClick={onConfirm} className="mt-6 w-full bg-[#F97316] hover:bg-[#EA580C]">
          {isLoading ? 'Confirmando...' : 'Confirmar compra'}
        </Button>
      </div>
    </main>
  );
}
