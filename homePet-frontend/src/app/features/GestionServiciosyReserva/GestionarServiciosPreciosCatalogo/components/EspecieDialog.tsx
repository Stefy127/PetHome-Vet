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
import type { Especie, EspeciePayload } from '../store'

interface EspecieDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  especie?: Especie | null
  onSubmit: (payload: EspeciePayload) => void
  isLoading?: boolean
}

export function EspecieDialog({
  open,
  onOpenChange,
  especie,
  onSubmit,
  isLoading,
}: EspecieDialogProps) {
  const form = useForm({
    defaultValues: {
      nombre: especie?.nombre || '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        nombre: especie?.nombre || '',
      })
    }
  }, [open, especie, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#7C3AED]">
            {especie ? 'Editar Especie' : 'Nueva Especie'}
          </DialogTitle>
          <DialogDescription>
            Registra una nueva categoría de animal para el sistema.
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
            <Label htmlFor="nombre_especie">Nombre de la Especie</Label>
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
                    id="nombre_especie"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Ej. Felino, Reptil, Equino"
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

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <form.Subscribe selector={(state) => [state.canSubmit]}>
              {([canSubmit]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="bg-[#F97316] text-white hover:bg-[#EA580C]"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Especie'}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
