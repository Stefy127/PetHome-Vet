import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Tratamiento } from "../../store"

interface Props {
  tratamientos: Tratamiento[]
  canCreate: boolean
  onNuevoTratamiento: () => void
  onEditarTratamiento: (tratamiento: Tratamiento) => void
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

export function TratamientosListSection({
  tratamientos,
  canCreate,
  onNuevoTratamiento,
  onEditarTratamiento,
}: Props) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold text-slate-900">Tratamientos</h3>
          {canCreate && (
            <Button
              type="button"
              onClick={onNuevoTratamiento}
              className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
            >
              Agregar tratamiento
            </Button>
          )}
        </div>

        {tratamientos.length === 0 ? (
          <p className="mt-4 text-slate-500">No hay tratamientos registrados.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {tratamientos.map((tratamiento) => (
              <div
                key={tratamiento.id_tratamiento}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{tratamiento.tipo || "Tratamiento"}</p>
                    <p className="mt-1 text-sm text-slate-700">{tratamiento.descripcion || "Sin descripción"}</p>
                    <p className="mt-1 text-sm text-slate-700">Observación: {tratamiento.observacion || "Sin observación"}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Inicio: {formatearFecha(tratamiento.fecha_ini)} | Fin: {formatearFecha(tratamiento.fecha_fin)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Estado: {tratamiento.estado_tratamiento || "Sin estado"}</p>
                  </div>

                  {canCreate && (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                      onClick={() => onEditarTratamiento(tratamiento)}
                    >
                      Editar tratamiento
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
