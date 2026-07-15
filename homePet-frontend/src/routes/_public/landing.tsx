import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '#/components/ui/button';

export const Route = createFileRoute('/_public/landing')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="bg-[#7C3AED] text-white">
      <section className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-center px-4 py-16">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Gestion SaaS para veterinarias sin friccion
        </h1>
        <p className="mt-4 max-w-2xl text-white/90">
          Prueba gratis por 7 dias. Crea tu trial en minutos o compra tu plan directo con checkout demo.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="bg-[#F97316] font-bold text-white hover:bg-[#EA580C]">
            <Link to="/trial-signup">Prueba gratis</Link>
          </Button>
          <Button asChild variant="outline" className="border-white bg-white font-bold text-[#7C3AED] hover:bg-white/90">
            <Link to="/pricing">Comprar ahora</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
