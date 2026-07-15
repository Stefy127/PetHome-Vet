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

export function HistorialesTableSection({
  historiales,
  canCreate,
  onVerDetalle,
  onNuevaConsulta,
}: Props) {
  return (
    <section className="hidden xl:block">
      <div className="overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-violet-700 text-white">
              <tr>
                <th className="w-[10%] px-3 py-4 text-left text-sm font-bold">Mascota</th>
                <th className="w-[12%] px-3 py-4 text-left text-sm font-bold">Especie / Raza</th>
                <th className="w-[13%] px-3 py-4 text-left text-sm font-bold">Propietario</th>
                <th className="w-[18%] px-3 py-4 text-left text-sm font-bold">Observaciones</th>
                <th className="w-[8%] px-3 py-4 text-left text-sm font-bold">Consultas</th>
                <th className="w-[14%] px-3 py-4 text-left text-sm font-bold">Última consulta</th>
                <th className="w-[9%] px-3 py-4 text-left text-sm font-bold">Estado</th>
                <th className="w-[16%] px-3 py-4 text-left text-sm font-bold">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {historiales.map((item) => {
                const totalConsultas = item.consultas_clinicas?.length || 0
                const ultimaConsulta =
                  totalConsultas > 0
                    ? item.consultas_clinicas?.[totalConsultas - 1]?.fecha_consulta
                    : undefined

                return (
                  <tr key={item.id_historial_clinico} className="border-b border-slate-100 align-top">
                    <td className="px-3 py-4 text-sm font-semibold text-slate-900">{item.mascota_nombre}</td>
                    <td className="px-3 py-4 text-sm text-slate-700">
                      <div className="flex flex-col gap-1">
                        <span className="w-fit rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs text-sky-700">
                          {item.mascota_especie || "Sin especie"}
                        </span>
                        <span className="text-xs text-slate-500">{item.mascota_raza || "Sin raza"}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-700">
                      <p className="break-words">{item.propietario_nombre || "Sin propietario"}</p>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-700">
                      <p className="line-clamp-2 break-words">{item.observaciones_generales || "Sin observaciones"}</p>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-700">{totalConsultas}</td>
                    <td className="px-3 py-4 text-sm text-slate-700">{formatearFecha(ultimaConsulta)}</td>
                    <td className="px-3 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.estado ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                        {item.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex flex-col gap-2">
                        <Button type="button" variant="outline" className="h-9 rounded-xl border-violet-300 px-3 text-xs text-violet-700 hover:bg-violet-50" onClick={() => onVerDetalle(item)}>
                          Ver detalle
                        </Button>
                        {canCreate && (
                          <Button type="button" className="h-9 rounded-xl bg-orange-500 px-3 text-xs text-white hover:bg-orange-600" onClick={() => onNuevaConsulta(item)}>
                            Nueva consulta
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}

              {historiales.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                    No se encontraron historiales clínicos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
