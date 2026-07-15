import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ClinicalHistory } from "../../store"

interface Props {
  historiales: ClinicalHistory[]
  canCreate: boolean
  onVerDetalle: (h: ClinicalHistory) => void
  onNuevaConsulta: (h: ClinicalHistory) => void
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

export function HistorialesCardsSection({
  historiales,
  canCreate,
  onVerDetalle,
  onNuevaConsulta,
}: Props) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:hidden">
      {historiales.map((item) => {
        const totalConsultas = item.consultas_clinicas?.length || 0
        const ultimaConsulta =
          totalConsultas > 0
            ? item.consultas_clinicas?.[totalConsultas - 1]?.fecha_consulta
            : undefined

        return (
          <Card
            key={item.id_historial_clinico}
            className="rounded-3xl border border-orange-200 bg-white shadow-sm"
          >
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    {item.mascota_nombre}
                  </h3>
                  <p className="text-slate-600">
                    {item.propietario_nombre || "Sin propietario"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-1 text-sm font-medium ${
                    item.estado
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {item.estado ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm text-sky-700">
                  {item.mascota_especie || "Sin especie"}
                </span>
                <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm text-violet-700">
                  {item.mascota_raza || "Sin raza"}
                </span>
                <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm text-orange-700">
                  Consultas: {totalConsultas}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-violet-600">
                    Observaciones
                  </p>
                  <p className="mt-1 text-slate-800">
                    {item.observaciones_generales || "Sin observaciones"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-violet-600">
                    Última consulta
                  </p>
                  <p className="mt-1 text-slate-800">
                    {formatearFecha(ultimaConsulta)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-violet-300 text-violet-700 hover:bg-violet-50"
                  onClick={() => onVerDetalle(item)}
                >
                  Ver detalle
                </Button>

                {canCreate && (
                  <Button
                    type="button"
                    className="w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                    onClick={() => onNuevaConsulta(item)}
                  >
                    Nueva consulta
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {historiales.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          No se encontraron historiales clínicos.
        </div>
      )}
    </section>
  )
}
