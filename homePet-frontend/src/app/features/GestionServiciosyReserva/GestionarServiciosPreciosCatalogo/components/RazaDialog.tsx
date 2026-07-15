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
import type { Especie, Raza, RazaPayload } from '../store'

interface RazaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  raza?: Raza | null
  especies: Especie[]
  onSubmit: (payload: RazaPayload) => void
  isLoading?: boolean
}

export function RazaDialog({
  open,
  onOpenChange,
  raza,
  especies,
  onSubmit,
  isLoading,
}: RazaDialogProps) {
  const form = useForm({
    defaultValues: {
      nombre: raza?.nombre || '',
      especie: raza?.especie || 0,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value as RazaPayload)
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        nombre: raza?.nombre || '',
        especie: raza?.especie || (especies.length > 0 ? especies[0].id_especie : 0),
      })
    }
  }, [open, raza, form, especies])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#7C3AED]">
            {raza ? 'Editar Raza' : 'Nueva Raza'}
          </DialogTitle>
          <DialogDescription>
            Asocia una nueva raza a una especie existente.
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
            <Label htmlFor="especie_id">Especie</Label>
            <form.Field name="especie">
              {(field) => (
                <select
                  id="especie_id"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-[#F97316]/30 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
                >
                  <option value={0} disabled>Seleccione una especie</option>
                  {especies.map((esp) => (
                    <option key={esp.id_especie} value={esp.id_especie}>
                      {esp.nombre}
                    </option>
                  ))}
                </select>
              )}
            </form.Field>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre_raza">Nombre de la Raza</Label>
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
                    id="nombre_raza"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Ej. Pastor Alemán, Persa, Chihuahua"
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
                  disabled={!canSubmit || isLoading || form.state.values.especie === 0}
                  className="bg-[#F97316] text-white hover:bg-[#EA580C]"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Raza'}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
