import { Link, createFileRoute } from '@tanstack/react-router'
import { CalendarCheck, Heart, ShieldCheck, Stethoscope } from 'lucide-react'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/_public/')({ component: HomePage })

function HomePage() {
  return (
    <main className="bg-[#7C3AED] text-white">
      <section className="mx-auto flex min-h-[520px] w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-3 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold">
            <Heart className="h-5 w-5 text-[#F97316]" fill="currentColor" />
            Pet Home
          </div>

          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Cuidamos a tus mascotas con amor y tecnologia.
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-white/90">
            Agenda servicios, administra tus mascotas y mantente cerca de su
            bienestar desde un solo lugar.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="bg-[#F97316] font-bold text-white hover:bg-[#EA580C]"
            >
              <Link to="/trial-signup">Prueba gratis</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-white bg-white text-[#7C3AED] font-bold hover:bg-white/90"
            >
              <Link to="/pricing">Comprar ahora</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 text-slate-900">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <article className="rounded-lg border border-slate-200 p-6">
            <Stethoscope className="mb-4 h-8 w-8 text-[#F97316]" />
            <h2 className="text-xl font-bold text-[#7C3AED]">Servicios</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Encuentra atencion y cuidado para cada etapa de vida de tu
              mascota.
            </p>
          </article>

          <article className="rounded-lg border border-slate-200 p-6">
            <CalendarCheck className="mb-4 h-8 w-8 text-[#F97316]" />
            <h2 className="text-xl font-bold text-[#7C3AED]">Reservas</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Organiza tus citas y consulta el historial cuando lo necesites.
            </p>
          </article>

          <article className="rounded-lg border border-slate-200 p-6">
            <ShieldCheck className="mb-4 h-8 w-8 text-[#F97316]" />
            <h2 className="text-xl font-bold text-[#7C3AED]">Confianza</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Tus datos y los de tus mascotas se mantienen protegidos.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
