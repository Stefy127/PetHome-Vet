import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { PrecioServicio, PrecioServicioPayload, Servicio } from '../store'

interface PrecioServicioFormProps {
  servicios: Servicio[]
  precio?: PrecioServicio | null
  onSubmit: (values: PrecioServicioPayload) => Promise<void> | void
  onCancel: () => void
  isLoading?: boolean
}
export const PrecioServicioForm = ({
  servicios,
  precio,
  onSubmit,
  onCancel,
  isLoading = false,
}: PrecioServicioFormProps) => {
  const form = useForm({
    defaultValues: {
      servicio: precio?.servicio ?? 0,
      variacion: precio?.variacion ?? 'General',
      modalidad: precio?.modalidad ?? '',
      precio: precio ? Number(precio.precio) : 0,
      descripcion: precio?.descripcion ?? '',
      estado: precio?.estado ?? true,
    } as PrecioServicioPayload,
    onSubmit: async ({ value }) => {
      await onSubmit({
        ...value,
        servicio: Number(value.servicio),
        variacion: value.variacion.trim(),
        modalidad: value.modalidad?.trim() || null,
        descripcion: value.descripcion?.trim() || null,
        precio: Number(value.precio),
      })
    },
  })
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field
        name="servicio"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Servicio</Label>
            <select
              id={field.name}
              className="flex h-10 w-full rounded-md border bg-background 
px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            >
              <option value={0}>Seleccione un servicio</option>
              {servicios.map((servicio) => (
                <option key={servicio.id_servicio} value={servicio.id_servicio}>
                  {servicio.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      />
      <form.Field
        name="variacion"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Variación</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej. Pequeño"
            />
          </div>
        )}
      />
      <form.Field
        name="modalidad"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Modalidad</Label>
            <select
              id={field.name}
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value)}
            >
              <option value="">Selecciona una modalidad</option>
              <option value="CLINICA">Clínica</option>
              <option value="DOMICILIO">Domicilio</option>
            </select>
          </div>
        )}
      />
      <form.Field
        name="precio"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Precio</Label>
            <Input
              id={field.name}
              type="number"
              min={0}
              step="0.01"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
        )}
      />
      <form.Field
        name="descripcion"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Descripción</Label>
            <Textarea
              id={field.name}
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Descripción del precio"
              rows={4}
            />
          </div>
        )}
      />
      <form.Field
        name="estado"
        children={(field) => (
          <label
            className="flex items-center gap-3 rounded-md border p-3 
text-sm"
          >
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
            />
            Precio activo
          </label>
        )}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : precio ? 'Actualizar' : 'Registrar'}
        </Button>
      </div>
    </form>
  )
}
