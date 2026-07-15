import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { HORAS_RESERVA, buildAddressSearchLink, buildMapUrl, buildMapsLink } from './utils'
import type { ReservaFormProps } from './types'

import type { Cita } from '../store/cliente.types'

const getHorasDisponibles = (
  horas: string[],
  citas: Cita[],
  fecha: string
): string[] => {
  if (!fecha) return horas

  return horas.filter((hora) => {
    return !citas.some((cita) => {
      return (
        cita.fecha_programada === fecha &&
        cita.hora_inicio.slice(0, 5) === hora &&
        (cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA')
      )
    })
  })
}

export function ReservaForm({
  availablePrecios,
  citas,
  canSubmit,
  creating,
  dateTimeIsFuture,
  editingId,
  form,
  handleSubmit,
  isFormOpen,
  isGettingLocation,
  loadingCatalogs,
  loadingMascotas,
  loadingServicios,
  mapCoords,
  mascotas,
  mascotasError,
  message,
  onCancel,
  onGetLocation,
  openChange,
  preciosError,
  servicios,
  serviciosError,
  updateField,
  updating,
}: ReservaFormProps) {

   
   const horasDisponibles = getHorasDisponibles(
      HORAS_RESERVA,
      citas || [],
      form.fecha_programada
    )

    const today = new Date()

    const maxDate = new Date()
    maxDate.setDate(today.getDate() + 10)

    const formatDate = (date: Date) =>
      date.toISOString().slice(0, 10)
  return (
    <Dialog open={isFormOpen} onOpenChange={openChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden bg-white p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-gray-200 px-6 py-5">
          <DialogTitle className="text-orange-500">
            {editingId ? 'Modificar reserva' : 'Agregar reserva nueva'}
          </DialogTitle>
          <DialogDescription>
            Completa los datos de la reserva y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="grid max-h-[calc(90vh-96px)] gap-4 overflow-y-auto px-6 py-5 md:grid-cols-2"
        >
          {message && (
            <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700 shadow-sm md:col-span-2">
              {message}
            </div>
          )}

          {loadingCatalogs && (
            <p className="text-sm text-gray-600 md:col-span-2">
              Cargando mascotas, servicios y precios...
            </p>
          )}

          {(mascotasError || serviciosError || preciosError) && (
            <p className="text-sm text-red-600 md:col-span-2">
              No se pudieron cargar todos los datos necesarios para crear la reserva.
              Revisa que el backend este encendido y que tu sesion siga activa.
            </p>
          )}

          <select
            value={form.mascota}
            onChange={(e) => updateField('mascota', e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800"
            required
          >
            <option value="">Selecciona mascota</option>
            {mascotas.map((mascota) => (
              <option key={mascota.id_mascota} value={mascota.id_mascota}>
                {mascota.nombre}
              </option>
            ))}
          </select>

          <select
            value={form.servicio}
            onChange={(e) => updateField('servicio', e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800"
            required
          >
           <option value="">Selecciona servicio</option>
            {servicios.map((servicio) => (
              <option key={servicio.id_servicio} value={servicio.id_servicio}>
                {servicio.nombre}
              </option>
            ))}
          </select>

          <select
            value={form.modalidad}
            onChange={(e) => updateField('modalidad', e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800"
          >
            <option value="CLINICA">Clinica</option>
            <option value="DOMICILIO">Domicilio</option>
          </select>

          <select
            value={form.precio_servicio}
            onChange={(e) => updateField('precio_servicio', e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800"
            disabled={!form.servicio}
            required
          >
            <option value="">Selecciona precio</option>
            {availablePrecios.map((precio) => (
              <option key={precio.id_precio} value={precio.id_precio}>
                {precio.variacion} - Bs. {precio.precio}
              </option>
            ))}
          </select>

          <Input
            type="date"
            value={form.fecha_programada}
            min={formatDate(today)}
            max={formatDate(maxDate)}
            onChange={(e) => updateField('fecha_programada', e.target.value)}
            required
          />

          <select
            value={form.hora_inicio}
            onChange={(e) => updateField('hora_inicio', e.target.value)}
            required
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 shadow-sm transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          >
            <option value="">Selecciona hora</option>
            {horasDisponibles.map((hora) => (
              <option key={hora} value={hora}>
                {hora}
              </option>
            ))}
          </select>

          {form.modalidad === 'DOMICILIO' && (
            <div className="flex flex-col gap-4 md:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={onGetLocation}
                  disabled={isGettingLocation}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {isGettingLocation ? 'Obteniendo ubicacion...' : 'Usar mi ubicacion'}
                </Button>

                {(mapCoords || form.direccion_cita.trim()) && (
                  <a
                    href={
                      mapCoords
                        ? buildMapsLink(mapCoords)
                        : buildAddressSearchLink(form.direccion_cita.trim())
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    Ver ubicacion en el mapa
                  </a>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Ubicacion o direccion de la cita
                </label>
                <Input
                  value={form.direccion_cita}
                  onChange={(e) => updateField('direccion_cita', e.target.value)}
                  placeholder="Escribe la direccion o pega coordenadas: -17.7833, -63.1821"
                  className="h-11 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-700 shadow-sm transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  required
                />
              </div>

              <p className="text-xs text-gray-500">
                Puedes escribir la direccion manualmente, corregirla al modificar o
                usar tu ubicacion actual. Si el texto contiene coordenadas,
                mostraremos el mapa aqui mismo.
              </p>

              {mapCoords && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <iframe
                    title="Mapa de ubicacion de la cita"
                    src={buildMapUrl(mapCoords)}
                    className="h-64 w-full border-0 bg-white"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          )}

          <Textarea
            className="md:col-span-2"
            placeholder="Descripcion o indicaciones"
            value={form.descripcion}
            onChange={(e) => updateField('descripcion', e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <Button
              disabled={!canSubmit || creating || updating}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {editingId ? 'Guardar cambios' : 'Crear reserva'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
              onClick={onCancel}
            >
              Cancelar
            </Button>

            {!dateTimeIsFuture && form.fecha_programada && form.hora_inicio && (
              <p className="text-sm text-red-600">La fecha y hora deben ser futuras.</p>
            )}

            {form.servicio && availablePrecios.length === 0 && (
              <p className="text-sm text-red-600">
                No hay un precio activo para ese servicio y modalidad.
              </p>
            )}

            {!loadingMascotas && !mascotasError && mascotas.length === 0 && (
              <p className="text-sm text-red-600">
                Primero registra una mascota para poder crear la reserva.
              </p>
            )}

            {!loadingServicios && !serviciosError && servicios.length === 0 && (
              <p className="text-sm text-red-600">
                No hay servicios activos disponibles para esta modalidad.
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
    
  )
}
