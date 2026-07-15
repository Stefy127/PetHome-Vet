import { Card, CardContent } from "@/components/ui/card"
import type { ConsultaClinica } from "../../store"

interface Props {
  consulta: ConsultaClinica
}

function valorTexto(valor?: string | number | null, sufijo = "") {
  if (valor === null || valor === undefined || valor === "") return "—"
  return `${valor}${sufijo}`
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

export function DatosClinicosSection({ consulta }: Props) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-slate-900">Datos clínicos</h3>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Peso
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {valorTexto(consulta.peso, " kg")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Temperatura
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {valorTexto(consulta.temperatura, " °C")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              F. cardiaca
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {valorTexto(consulta.frecuencia_cardiaca, " lpm")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              F. respiratoria
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {valorTexto(consulta.frecuencia_respiratoria, " rpm")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Próxima revisión
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {consulta.proxima_revision
                ? formatearFecha(consulta.proxima_revision)
                : "No registrada"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
