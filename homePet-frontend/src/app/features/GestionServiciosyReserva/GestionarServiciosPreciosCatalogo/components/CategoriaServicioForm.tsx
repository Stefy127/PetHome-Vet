import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CategoriaServicio, CategoriaServicioPayload } from '../store'

interface CategoriaServicioFormProps {
  categoria?: CategoriaServicio | null
  onSubmit: (values: CategoriaServicioPayload) => Promise<void> | void
  onCancel: () => void
  isLoading?: boolean
}
export const CategoriaServicioForm = ({
  categoria,
  onSubmit,
  onCancel,
  isLoading = false,
}: CategoriaServicioFormProps) => {
  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? '',
      descripcion: categoria?.descripcion ?? '',
      estado: categoria?.estado ?? true,
    } as CategoriaServicioPayload,
    onSubmit: async ({ value }) => {
      await onSubmit({
        ...value,
        nombre: value.nombre.trim(),
        descripcion: value.descripcion?.trim() || null,
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
              placeholder="Ej. Vacunación"
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
              placeholder="Descripción de la categoría"
              rows={4}
            />
          </div>
        )}
      />
      <form.Field
        name="estado"
        children={(field) => (
          <label className="flex items-center gap-3 rounded-md border p-3 text-sm">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
            />
            Categoría activa
          </label>
        )}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : categoria ? 'Actualizar' : 'Registrar'}
        </Button>
      </div>
    </form>
  )
}
