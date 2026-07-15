import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { VacunaAplicada } from "../../store"

interface Props {
  vacunas: VacunaAplicada[]
  canCreate: boolean
  onNuevaVacuna: () => void
  onEditarVacuna: (vacuna: VacunaAplicada) => void
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

export function VacunasListSection({
  vacunas,
  canCreate,
  onNuevaVacuna,
  onEditarVacuna,
}: Props) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold text-slate-900">Vacunas aplicadas</h3>
          {canCreate && (
            <Button
              type="button"
              onClick={onNuevaVacuna}
              className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
            >
              Agregar vacuna
            </Button>
          )}
        </div>

        {vacunas.length === 0 ? (
          <p className="mt-4 text-slate-500">No hay vacunas registradas.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {vacunas.map((vacuna) => (
              <div
                key={vacuna.id_vacuna_aplicada}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{vacuna.nombre_vacuna || "Vacuna"}</p>
                    <p className="mt-1 text-sm text-slate-700">Dosis: {vacuna.dosis || "Sin dosis"}</p>
                    <p className="mt-1 text-sm text-slate-700">Fecha aplicada: {formatearFecha(vacuna.fecha_aplicada)}</p>
                    <p className="mt-1 text-sm text-slate-700">Próxima fecha: {formatearFecha(vacuna.fecha_proxima)}</p>
                    <p className="mt-1 text-sm text-slate-700">Lote: {vacuna.lote || "Sin lote"}</p>
                    <p className="mt-1 text-sm text-slate-700">Fabricante: {vacuna.fabricante || "Sin fabricante"}</p>
                    <p className="mt-1 text-sm text-slate-700">Observación: {vacuna.observacion || "Sin observación"}</p>
                    <p className="mt-1 text-xs text-slate-500">Estado vacuna: {vacuna.estado_vacuna || "Sin estado"}</p>
                  </div>

                  {canCreate && (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                      onClick={() => onEditarVacuna(vacuna)}
                    >
                      Editar vacuna
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
