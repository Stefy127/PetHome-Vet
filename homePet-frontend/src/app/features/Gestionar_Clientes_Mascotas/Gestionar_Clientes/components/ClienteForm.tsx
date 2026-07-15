'use client'

import { useEffect } from 'react'
import type { ClienteCreatePayload, Cliente } from '../store/gestionarClientes.types'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, MapPin } from 'lucide-react'

interface ClienteFormProps {
  cliente?: Cliente
  onSubmit: (data: ClienteCreatePayload) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ClienteForm({
  cliente,
  onSubmit,
  onCancel,
  isLoading,
}: ClienteFormProps) {
  const form = useForm({
    defaultValues: {
      nombre: cliente?.nombre || '',
      correo: cliente?.correo || '',
      telefono: cliente?.telefono || '',
      direccion: cliente?.direccion || '',
      password: '', // Requerido para creación por backend
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  // Asegura reinicialización cuando el cliente cambia
  useEffect(() => {
    form.reset({
      nombre: cliente?.nombre || '',
      correo: cliente?.correo || '',
      telefono: cliente?.telefono || '',
      direccion: cliente?.direccion || '',
      password: '',
    })
  }, [cliente, form])

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="nombre" className="text-white">
          Nombre completo
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
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="nombre"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Ej: Carlos Roca"
                  className="pl-9 bg-white text-black"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-orange-200">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <Label htmlFor="correo" className="text-white">
          Correo electrónico
        </Label>
        <form.Field
          name="correo"
          validators={{
            onChange: ({ value }) => {
              if (!value.trim()) return 'El correo es requerido'
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                return 'Ingrese un correo válido'
              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="correo"
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="cliente@ejemplo.com"
                  className="pl-9 bg-white text-black"
                  disabled={!!cliente} // Generalmente no se edita el email
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-orange-200">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </>
          )}
        </form.Field>
      </div>

      {!cliente && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Contraseña temporal (Requerida)
          </Label>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value?.trim() ? 'La contraseña es requerida' : undefined,
            }}
          >
            {(field) => (
              <>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Contraseña"
                    className="bg-white text-black pl-3"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-orange-200">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          </form.Field>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="telefono" className="text-white">
          Teléfono
        </Label>
        <form.Field
          name="telefono"
          validators={{
            onChange: ({ value }) => {
              if (!value?.trim()) return 'El teléfono es requerido'
              if (!/^\d{8}$/.test(value))
                return 'El teléfono debe tener 8 dígitos'
              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="telefono"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value.replace(/\D/g, '').slice(0, 8)
                    )
                  }
                  onBlur={field.handleBlur}
                  placeholder="70123456"
                  className="pl-9 bg-white text-black"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-orange-200">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion" className="text-white">
          Ubicación / Dirección
        </Label>
        <form.Field
          name="direccion"
          validators={{
            onChange: ({ value }) =>
              !value?.trim() ? 'La ubicación es requerida' : undefined,
          }}
        >
          {(field) => (
            <>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="direccion"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Ej: Av. Cristo Redentor, 4to anillo"
                  className="pl-9 bg-white text-black"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-orange-200">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </>
          )}
        </form.Field>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isLoading || isSubmitting}
              className="bg-[#F97316] text-white hover:opacity-90"
            >
              {isLoading || isSubmitting
                ? 'Guardando...'
                : cliente
                ? 'Actualizar cliente'
                : 'Registrar cliente'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}