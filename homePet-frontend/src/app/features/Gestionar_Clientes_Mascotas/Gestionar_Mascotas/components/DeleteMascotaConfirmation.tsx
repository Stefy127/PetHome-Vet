import { Button } from "@/components/ui/button"
import type { Mascota } from "../types"

interface DeleteMascotaConfirmationProps {
  open: boolean
  mascota: Mascota | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteMascotaConfirmation({
  open,
  mascota,
  onClose,
  onConfirm,
}: DeleteMascotaConfirmationProps) {
  if (!open || !mascota) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[3px]">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#FED7AA]">
        <div className="h-2 w-full bg-gradient-to-r from-[#F97316] via-[#FB7185] to-[#EF4444]" />

        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border border-red-200">
              <span className="text-3xl">⚠️</span>
            </div>

            <h3 className="text-2xl font-bold text-[#18181B]">
              Confirmar eliminación
            </h3>

            <p className="mt-3 text-base leading-7 text-[#52525B]">
              Vas a eliminar a{" "}
              <span className="font-semibold text-[#18181B]">{mascota.nombre}</span>.
              <br />
              Esta acción es permanente y no se puede deshacer.
            </p>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-11 rounded-xl border-[#8B5CF6] px-6 text-[#7C3AED] hover:bg-[#F5F3FF]"
            >
              Cancelar
            </Button>

            <Button
              onClick={onConfirm}
              className="h-11 rounded-xl bg-red-500 px-6 text-white hover:bg-red-600"
            >
              Eliminar mascota
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}