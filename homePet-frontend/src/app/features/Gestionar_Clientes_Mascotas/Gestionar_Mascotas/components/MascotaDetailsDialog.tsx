import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Mascota } from "../types"

interface MascotaDetailsDialogProps {
  open: boolean
  mascota: Mascota | null
  onClose: () => void
}

function DetailCard({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="rounded-2xl border border-[#FFEDD5] bg-[#FFFDFB] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[#18181B]">
        {value === null || value === undefined || value === ""
          ? "No registrado"
          : String(value)}
      </p>
    </div>
  )
}

function getEstadoTexto(estado: boolean) {
  return estado ? "Activo" : "Inactivo"
}

function formatFechaRegistro(fecha: string | null | undefined) {
  if (!fecha) return "No registrado"

  try {
    return new Date(fecha).toLocaleString("es-BO")
  } catch {
    return fecha
  }
}

function getPesoTexto(peso: number | null | undefined) {
  if (peso === null || peso === undefined) return "No registrado"
  return `${peso} kg`
}

export function MascotaDetailsDialog({
  open,
  mascota,
  onClose,
}: MascotaDetailsDialogProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open || !mascota) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[#FED7AA] bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] px-6 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/85">Ficha de mascota</p>
                <h3 className="mt-1 text-2xl font-bold">{mascota.nombre}</h3>
                <p className="mt-1 text-sm text-white/90">
                  {mascota.especie?.nombre ?? "Sin especie"} ·{" "}
                  {mascota.raza?.nombre ?? "Sin raza"}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard label="Especie" value={mascota.especie?.nombre} />
              <DetailCard label="Raza" value={mascota.raza?.nombre} />
              <DetailCard label="Propietario" value={mascota.usuario?.nombre} />
              <DetailCard label="Color" value={mascota.color} />
              <DetailCard label="Sexo" value={mascota.sexo} />
              <DetailCard label="Tamaño" value={mascota.tamano} />
              <DetailCard label="Peso" value={getPesoTexto(mascota.peso)} />
              <DetailCard label="Estado" value={getEstadoTexto(mascota.estado)} />
              <DetailCard label="Fecha de nacimiento" value={mascota.fecha_nac} />
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-[#FFEDD5] bg-[#FFFDFB] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                  Alergias
                </p>
                <p className="mt-2 text-sm text-[#18181B]">
                  {mascota.alergias || "No registrado"}
                </p>
              </div>

              <div className="rounded-2xl border border-[#FFEDD5] bg-[#FFFDFB] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                  Notas generales
                </p>
                <p className="mt-2 text-sm text-[#18181B]">
                  {mascota.notas_generales || "No registrado"}
                </p>
              </div>
            </div>

            <details className="mt-6 rounded-2xl border border-[#FED7AA] bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold text-[#7C3AED]">
                Ver información técnica
              </summary>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <DetailCard label="Foto" value={mascota.foto} />
                <DetailCard
                  label="Fecha de registro"
                  value={formatFechaRegistro(mascota.fecha_registro)}
                />
              </div>
            </details>
          </div>

          <div className="border-t border-[#FFEDD5] bg-white px-6 py-4">
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="rounded-xl bg-[#F97316] text-white hover:bg-[#EA580C]"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}