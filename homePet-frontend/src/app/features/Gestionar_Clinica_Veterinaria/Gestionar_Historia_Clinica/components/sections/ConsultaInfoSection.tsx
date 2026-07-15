import { Card, CardContent } from "@/components/ui/card"
import type { ConsultaClinica } from "../../store"

interface Props {
  consulta: ConsultaClinica
}

function formatearFecha(fecha?: string | null) {
  if (!fecha) return "Sin fecha"
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function ConsultaInfoSection({ consulta }: Props) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
            Mascota
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {consulta.mascota_nombre || "Sin mascota"}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
            Propietario
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {consulta.propietario_nombre || "Sin propietario"}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
            Veterinario
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {consulta.veterinario_nombre || "Sin veterinario"}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
            Fecha de consulta
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {formatearFecha(consulta.fecha_consulta)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
