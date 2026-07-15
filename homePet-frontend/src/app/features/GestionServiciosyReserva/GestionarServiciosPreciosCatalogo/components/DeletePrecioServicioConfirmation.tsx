import { TriangleAlert } from 'lucide-react'
import type { PrecioServicio } from '../store'

interface DeletePrecioServicioConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  precio?: PrecioServicio | null
  onConfirm: () => void
  isLoading?: boolean
}

export function DeletePrecioServicioConfirmation({
  open,
  onOpenChange,
  precio,
  onConfirm,
  isLoading = false,
}: DeletePrecioServicioConfirmationProps) {
  if (!open) return null

  const actionLabel = precio?.estado ? 'Desactivar' : 'Activar'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#F97316]/30 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-red-100 p-2">
            <TriangleAlert className="h-5 w-5 text-red-600" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-black">
              {actionLabel} precio
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Se cambiará el estado del precio para el servicio{' '}
              <span className="font-medium text-black">
                {precio?.servicio_nombre ?? ''}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="rounded-xl bg-[#F97316] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? 'Procesando...' : actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
