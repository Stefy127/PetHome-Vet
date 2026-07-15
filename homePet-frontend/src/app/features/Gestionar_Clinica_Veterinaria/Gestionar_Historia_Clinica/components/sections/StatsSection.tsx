import { Card, CardContent } from "@/components/ui/card"

interface Props {
  stats: {
    total: number
    activos: number
    totalConsultas: number
  }
}

export function StatsSection({ stats }: Props) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card className="rounded-3xl border border-orange-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <p className="text-lg text-slate-800">Total historiales</p>
          <p className="mt-4 text-4xl font-extrabold text-violet-600 md:text-6xl">
            {stats.total}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-orange-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <p className="text-lg text-slate-800">Historiales activos</p>
          <p className="mt-4 text-4xl font-extrabold text-orange-500 md:text-6xl">
            {stats.activos}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-orange-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <p className="text-lg text-slate-800">Consultas registradas</p>
          <p className="mt-4 text-4xl font-extrabold text-violet-600 md:text-6xl">
            {stats.totalConsultas}
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
