import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import type { ReservasListProps } from './types'

export function ReservasList({
  cancelId,
  cancelReason,
  canceling,
  citas,
  citasError,
  loadingCitas,
  onCancelReasonChange,
  onCloseCancel,
  onConfirmCancel,
  onOpenCancel,
  onStartEdit,
}: ReservasListProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Reservas registradas</h2>

      {loadingCitas ? (
        <p className="mt-3 text-sm text-gray-600">Cargando reservas...</p>
      ) : citasError ? (
        <p className="mt-3 text-sm text-red-600">No se pudieron cargar tus reservas.</p>
      ) : citas.length === 0 ? (
        <p className="mt-3 text-sm text-gray-600">Aun no tienes reservas.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {citas.map((cita) => (
            <div key={cita.id_cita} className="rounded-lg border border-gray-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {cita.servicio_nombre || 'Servicio'} para{' '}
                    {cita.mascota_nombre || 'mascota'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {cita.fecha_programada} a las {cita.hora_inicio.slice(0, 5)} -{' '}
                    {cita.modalidad}
                  </p>
                  {cita.direccion_cita && (
                    <p className="text-sm text-gray-500">
                      Ubicacion: {cita.direccion_cita}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">Estado: {cita.estado}</p>
                </div>

                <div className="flex gap-2">
                  {cita.estado === 'PENDIENTE' && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                      onClick={() => onStartEdit(cita)}
                    >
                      Modificar
                    </Button>
                  )}
                  {cita.estado === 'PENDIENTE' && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => onOpenCancel(cita.id_cita)}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {cancelId === cita.id_cita && (
                <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
                  <Textarea
                    placeholder="Motivo de cancelacion"
                    value={cancelReason}
                    onChange={(e) => onCancelReasonChange(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      disabled={canceling || !cancelReason.trim()}
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                      onClick={onConfirmCancel}
                    >
                      Confirmar cancelacion
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={onCloseCancel}
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
