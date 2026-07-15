import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CategoriaServicio, Servicio, ServicioPayload } from '../store'

interface ServicioFormProps {
  categorias: CategoriaServicio[]
  servicio?: Servicio | null
  onSubmit: (values: ServicioPayload) => Promise<void> | void
  onCancel: () => void
  isLoading?: boolean
}
export const ServicioForm = ({
  categorias,
  servicio,
  onSubmit,
  onCancel,
  isLoading = false,
}: ServicioFormProps) => {
  const form = useForm({
    defaultValues: {
      nombre: servicio?.nombre ?? '',
      descripcion: servicio?.descripcion ?? '',
      categoria: servicio?.categoria ?? 0,
      duracion_estimada: servicio?.duracion_estimada ?? null,
      disponible_domicilio: servicio?.disponible_domicilio ?? true,
      estado: servicio?.estado ?? true,
    } as ServicioPayload,
    onSubmit: async ({ value }) => {
      await onSubmit({
        ...value,
        nombre: value.nombre.trim(),
        descripcion: value.descripcion?.trim() || null,
        categoria: Number(value.categoria),
        duracion_estimada:
          value.duracion_estimada === null ||
          value.duracion_estimada === undefined
            ? null
            : Number(value.duracion_estimada),
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
        name="nombre"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nombre</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej. Baño medicado"
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
              placeholder="Descripción del servicio"
              rows={4}
            />
          </div>
        )}
      />
      <form.Field
        name="categoria"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Categoría</Label>
            <select
              id={field.name}
              className="flex h-10 w-full rounded-md border bg-background 
px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            >
              <option value={0}>Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option
                  key={categoria.id_categoria}
                  value={categoria.id_categoria}
                >
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      />
      <form.Field
        name="duracion_estimada"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Duración estimada (minutos)</Label>
            <Input
              id={field.name}
              type="number"
              min={0}
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) => {
                const value = e.target.value
                field.handleChange(value === '' ? null : Number(value))
              }}
              placeholder="Ej. 45"
            />
          </div>
        )}
      />
      <form.Field
        name="disponible_domicilio"
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
            Disponible a domicilio
          </label>
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
            Servicio activo
          </label>
        )}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : servicio ? 'Actualizar' : 'Registrar'}
        </Button>
      </div>
    </form>
  )
}
