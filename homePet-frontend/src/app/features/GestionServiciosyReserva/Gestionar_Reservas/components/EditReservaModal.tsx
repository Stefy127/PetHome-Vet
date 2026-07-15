import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import type { ModalidadReserva } from '../store/reservas.types'

// 🔥 HORAS IGUAL QUE CLIENTE
const HORAS_RESERVA = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

type Props = {
  editing: any
  setEditing: (value: any) => void
  onChangeEditing: (field: any, value: string) => void
  saveEdit: () => void
  mascotas: any[]
  servicios: any[]
  preciosFiltrados: any[]
  modalidadOptions: ModalidadReserva[]
}


export const EditReservaModal = ({
  editing,
  setEditing,
  onChangeEditing,
  saveEdit,
  mascotas,
  servicios,
  preciosFiltrados,
  modalidadOptions,
}: Props) => {
  if (!editing) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setEditing(null)}
    >
      <div
        className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 text-violet-800">
          <h2 className="text-lg font-semibold">
            Editar Reserva #{editing.id}
          </h2>
          <Button
            className="bg-violet-800 text-white"
            onClick={() => setEditing(null)}
          >
            X
          </Button>
        </div>

        {/* Formulario */}
        <div className="grid gap-3 md:grid-cols-3">

          {/* Mascota */}
          <select
            value={editing.mascota}
            onChange={(e) => onChangeEditing('mascota', e.target.value)}
            className="h-10 border rounded px-3 text-sm"
          >
            <option value="">Mascota</option>
            {mascotas.map((m) => (
              <option key={m.id_mascota} value={m.id_mascota}>
                {m.nombre}
              </option>
            ))}
          </select>

          {/* Servicio */}
          <select
            value={editing.servicio}
            onChange={(e) => onChangeEditing('servicio', e.target.value)}
            className="h-10 border rounded px-3 text-sm"
          >
            <option value="">Servicio</option>
            {servicios.filter(s => s.estado).map((s) => (
              <option key={s.id_servicio} value={s.id_servicio}>
                {s.nombre}
              </option>
            ))}
          </select>

          {/* Modalidad */}
          <select
            value={editing.modalidad}
            onChange={(e) => onChangeEditing('modalidad', e.target.value)}
            className="h-10 border rounded px-3 text-sm"
          >
            {modalidadOptions.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Precio */}
          <select
            value={editing.precio_servicio}
            onChange={(e) => onChangeEditing('precio_servicio', e.target.value)}
            className="h-10 border rounded px-3 text-sm"
          >
            <option value="">Precio</option>
            {preciosFiltrados.map((p) => (
              <option key={p.id_precio} value={p.id_precio}>
                {p.variacion} - Bs. {p.precio}
              </option>
            ))}
          </select>
      

          {/* Fecha */}
          <Input
            type="date"
            value={editing.fecha_programada}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => onChangeEditing('fecha_programada', e.target.value)}
          />

          {/* 🔥 HORA (CORREGIDO IGUAL QUE CLIENTE) */}
          <select
            value={editing.hora_inicio}
            onChange={(e) => onChangeEditing('hora_inicio', e.target.value)}
            className="h-10 border rounded px-3 text-sm"
          >
            <option value="">Selecciona hora</option>
            {HORAS_RESERVA.map((hora) => (
              <option key={hora} value={hora}>
                {hora}
              </option>
            ))}
          </select>

          {/* Dirección */}
          {editing.modalidad === 'DOMICILIO' && (
            <Input
              className="md:col-span-3"
              placeholder="Dirección"
              value={editing.direccion_cita}
              onChange={(e) => onChangeEditing('direccion_cita', e.target.value)}
            />
          )}

          {/* Descripción */}
          <Input
            className="md:col-span-3"
            placeholder="Descripción"
            value={editing.descripcion}
            onChange={(e) => onChangeEditing('descripcion', e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            className="bg-orange-500 text-white"
            onClick={saveEdit}
          >
            Guardar
          </Button>

          <Button
            variant="outline"
            onClick={() => setEditing(null)}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}