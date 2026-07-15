import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '#/components/ui/button';

export const Route = createFileRoute('/_public/stripe-cancel')({
  component: StripeCancelPage,
});

function StripeCancelPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center px-4 py-10">
      <div className="rounded-2xl bg-white p-8 text-slate-900">
        <h1 className="text-2xl font-bold">Pago cancelado</h1>
        <p className="mt-2 text-slate-600">
          No se realizo ningun cobro. Puedes intentarlo nuevamente.
        </p>
        <Button asChild className="mt-6 w-full bg-[#7C3AED] hover:bg-[#6A24D4]">
          <Link to="/pricing">Volver a pricing</Link>
        </Button>
      </div>
    </main>
  );
}
