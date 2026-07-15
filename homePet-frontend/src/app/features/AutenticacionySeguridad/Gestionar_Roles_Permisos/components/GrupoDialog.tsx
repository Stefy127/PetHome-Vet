import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { GrupoCreatePayload, GrupoUsuario } from '../store/rolesPermisos.types'

interface GrupoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  grupoInicial?: GrupoUsuario | null
  onSubmit: (payload: GrupoCreatePayload) => void
  loading?: boolean
}

export function GrupoDialog({
  open,
  onOpenChange,
  grupoInicial,
  onSubmit,
  loading,
}: GrupoDialogProps) {
  const form = useForm({
    defaultValues: {
      nombre: grupoInicial?.nombre || '',
      descripcion: grupoInicial?.descripcion || '',
      estado: grupoInicial?.estado ?? true,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        nombre: grupoInicial?.nombre || '',
        descripcion: grupoInicial?.descripcion || '',
        estado: grupoInicial?.estado ?? true,
      })
    }
  }, [open, grupoInicial, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#7C3AED]">
            {grupoInicial ? 'Editar Rol' : 'Crear Nuevo Rol'}
          </DialogTitle>
          <DialogDescription>
            {grupoInicial 
              ? 'Modifica la información básica de este grupo de usuarios.' 
              : 'Define un nuevo grupo para organizar los permisos de la veterinaria.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Nombre del Rol / Grupo
            </Label>
            <form.Field
              name="nombre"
              validators={{
                onChange: ({ value }) =>
                  !value.trim() ? 'El nombre es requerido' : undefined,
              }}
            >
              {(field) => (
                <>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Ej. Recepcionista, Veterinario Junior"
                    className="border-[#F97316]/30 focus-visible:ring-[#F97316]"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-red-500">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </>
              )}
            </form.Field>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Descripción
            </Label>
            <form.Field name="descripcion">
              {(field) => (
                <Input
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Descripción breve de las responsabilidades..."
                  className="border-[#F97316]/30 focus-visible:ring-[#F97316]"
                />
              )}
            </form.Field>
          </div>

          {grupoInicial && (
            <form.Field name="estado">
              {(field) => (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="estado_grupo"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                  />
                  <Label htmlFor="estado_grupo" className="text-sm text-slate-700">
                    Rol Activo
                  </Label>
                </div>
              )}
            </form.Field>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-slate-300 text-slate-700"
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || loading || isSubmitting}
                  className="bg-[#F97316] text-white hover:bg-[#EA580C]"
                >
                  {loading || isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
