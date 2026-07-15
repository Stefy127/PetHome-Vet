import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import type {
  ClienteOption,
  EspecieOption,
  MascotaFormValues,
  RazaOption,
} from "../types"
import { MascotaForm } from "./MascotaForm"

interface MascotaDialogProps {
  open: boolean
  title: string
  values: MascotaFormValues
  clientes: ClienteOption[]
  especies: EspecieOption[]
  razas: RazaOption[]
  onChange: (
    field: keyof MascotaFormValues,
    value: string | number | boolean,
  ) => void
  onEspecieChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
}

export function MascotaDialog({
  open,
  title,
  values,
  clientes,
  especies,
  razas,
  onChange,
  onEspecieChange,
  onClose,
  onSubmit,
}: MascotaDialogProps) {
  useEffect(() => {
    if (!open) return

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#FED7AA] bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] px-6 py-5 text-white">
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-1 text-sm text-white/90">
                Completa la información de la mascota
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="ml-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <MascotaForm
              values={values}
              clientes={clientes}
              especies={especies}
              razas={razas}
              onChange={onChange}
              onEspecieChange={onEspecieChange}
            />
          </div>

          <div className="border-t border-[#FFEDD5] bg-white px-6 py-4">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-xl border-[#8B5CF6] text-[#7C3AED] hover:bg-[#F5F3FF]"
              >
                Cancelar
              </Button>

              <Button
                onClick={onSubmit}
                className="rounded-xl bg-[#F97316] text-white hover:bg-[#EA580C]"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}