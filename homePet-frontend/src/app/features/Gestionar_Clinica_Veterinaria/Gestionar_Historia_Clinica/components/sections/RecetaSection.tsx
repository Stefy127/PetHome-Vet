import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Receta, DetalleReceta } from "../../store"

interface Props {
  receta: Receta | null
  canCreate: boolean
  onNuevaReceta: () => void
  onEditarReceta: (receta: Receta) => void
  onNuevoDetalleReceta: () => void
  onEditarDetalleReceta: (detalle: DetalleReceta) => void
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

export function RecetaSection({
  receta,
  canCreate,
  onNuevaReceta,
  onEditarReceta,
  onNuevoDetalleReceta,
  onEditarDetalleReceta,
}: Props) {
  const detallesReceta = receta?.detalles ?? []

  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold text-slate-900">Receta</h3>

          {canCreate && (
            <>
              {!receta ? (
                <Button
                  type="button"
                  onClick={onNuevaReceta}
                  className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                >
                  Crear receta
                </Button>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={onNuevoDetalleReceta}
                    className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                  >
                    Agregar detalle
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onEditarReceta(receta)}
                    className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Editar receta
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {!receta ? (
          <p className="mt-4 text-slate-500">No hay receta registrada.</p>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">
                Fecha: {formatearFecha(receta.fecha)}
              </p>
              <p className="mt-2 font-semibold text-slate-900">
                Indicaciones: {receta.indicaciones || "Sin indicaciones"}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Observación: {receta.observacion || "Sin observación"}
              </p>
            </div>

            {detallesReceta.length === 0 ? (
              <p className="text-slate-500">No hay detalles de receta.</p>
            ) : (
              <div className="space-y-3">
                {detallesReceta.map((detalle) => (
                  <div
                    key={detalle.id_detalle_receta}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">
                          {detalle.medicamento || "Medicamento"}
                        </p>
                        <p className="mt-1 text-sm text-slate-700">Dosis: {detalle.dosis || "—"}</p>
                        <p className="mt-1 text-sm text-slate-700">Frecuencia: {detalle.frecuencia || "—"}</p>
                        <p className="mt-1 text-sm text-slate-700">Duración: {detalle.duracion_dias ?? "—"} días</p>
                        <p className="mt-1 text-sm text-slate-700">Indicaciones adicionales: {detalle.indicaciones_adicionales || "—"}</p>
                        <p className="mt-1 text-xs text-slate-500">Producto asociado: {detalle.id_producto ?? "Sin producto"}</p>
                      </div>

                      {canCreate && (
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                          onClick={() => onEditarDetalleReceta(detalle)}
                        >
                          Editar detalle
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
