import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export interface MascotaOption {
  id: number
  nombre: string
  propietario_id?: number | string
  propietario_nombre?: string
  especie_nombre?: string
  raza_nombre?: string
}

interface PropietarioOption {
  id: number | string
  nombre: string
}

interface NuevoHistorialClinicoPayload {
  mascota: number
  observaciones_generales: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  mascotas: MascotaOption[]
  propietarios: PropietarioOption[]
  loading?: boolean
  onSubmit: (payload: NuevoHistorialClinicoPayload) => Promise<void>
}

function valorSeguro(value: unknown) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value)
  }

  if (value && typeof value === "object" && "nombre" in value) {
    const nombre = (value as { nombre?: unknown }).nombre
    if (typeof nombre === "string" || typeof nombre === "number") {
      return String(nombre)
    }
  }

  return ""
}

export function NuevoHistorialClinicoDialog({
  open,
  onOpenChange,
  mascotas,
  propietarios,
  loading = false,
  onSubmit,
}: Props) {
  const [propietarioId, setPropietarioId] = useState("")
  const [mascotaId, setMascotaId] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setPropietarioId("")
      setMascotaId("")
      setObservaciones("")
      setError("")
    }
  }, [open])

  const mascotasFiltradas = useMemo(() => {
    if (!propietarioId) return []
    return mascotas.filter(
      (m) => String(m.propietario_id ?? "") === String(propietarioId)
    )
  }, [mascotas, propietarioId])

  const mascotaSeleccionada = useMemo(() => {
    return mascotasFiltradas.find((m) => String(m.id) === mascotaId) || null
  }, [mascotasFiltradas, mascotaId])

  const propietarioSeleccionado = useMemo(() => {
    return propietarios.find((p) => String(p.id) === String(propietarioId)) || null
  }, [propietarios, propietarioId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!propietarioId) {
      setError("Debes seleccionar un propietario.")
      return
    }

    if (!mascotaId) {
      setError("Debes seleccionar una mascota.")
      return
    }

    try {
      await onSubmit({
        mascota: Number(mascotaId),
        observaciones_generales: observaciones.trim(),
      })

      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      const backendError =
        err?.data && typeof err.data === "object"
          ? JSON.stringify(err.data)
          : "No se pudo crear el historial clínico."
      setError(backendError)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[95vw] sm:!max-w-[1100px] max-h-[90vh] overflow-hidden rounded-[32px] border border-orange-200 bg-white p-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
          <div className="bg-gradient-to-r from-violet-700 via-violet-500 to-violet-400 px-8 py-7 text-white md:px-10">
            <div className="pr-10">
              <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
                Nuevo historial clínico
              </h2>
              <p className="mt-2 text-base text-white/90 md:text-xl">
                Completa la información para registrar un historial clínico.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-7 md:px-10">
            <div className="space-y-6">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <section className="rounded-[28px] border border-orange-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-violet-600">
                    Datos principales
                  </h3>
                  <p className="mt-1 text-base text-slate-600">
                    Primero selecciona el propietario y luego la mascota.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-base font-semibold text-slate-800">
                      Propietario
                    </label>
                    <select
                      value={propietarioId}
                      onChange={(e) => {
                        setPropietarioId(e.target.value)
                        setMascotaId("")
                      }}
                      className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-800 outline-none transition focus:border-violet-500"
                    >
                      <option value="">Selecciona un propietario</option>
                      {propietarios.map((prop) => (
                        <option key={prop.id} value={prop.id}>
                          {prop.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-semibold text-slate-800">
                      Mascota
                    </label>
                    <select
                      value={mascotaId}
                      onChange={(e) => setMascotaId(e.target.value)}
                      disabled={!propietarioId}
                      className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-800 outline-none transition focus:border-violet-500 disabled:bg-slate-100"
                    >
                      <option value="">
                        {!propietarioId
                          ? "Primero selecciona propietario"
                          : "Selecciona una mascota"}
                      </option>
                      {mascotasFiltradas.map((mascota) => (
                        <option key={mascota.id} value={mascota.id}>
                          {mascota.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-semibold text-slate-800">
                      Propietario seleccionado
                    </label>
                    <Input
                      value={valorSeguro(propietarioSeleccionado?.nombre)}
                      readOnly
                      placeholder="Se completará automáticamente"
                      className="h-14 rounded-2xl border-slate-300 bg-slate-50 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-semibold text-slate-800">
                      Especie
                    </label>
                    <Input
                      value={valorSeguro(mascotaSeleccionada?.especie_nombre)}
                      readOnly
                      placeholder="Se completará automáticamente"
                      className="h-14 rounded-2xl border-slate-300 bg-slate-50 text-base"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-base font-semibold text-slate-800">
                      Raza
                    </label>
                    <Input
                      value={valorSeguro(mascotaSeleccionada?.raza_nombre)}
                      readOnly
                      placeholder="Se completará automáticamente"
                      className="h-14 rounded-2xl border-slate-300 bg-slate-50 text-base"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-base font-semibold text-slate-800">
                      Observaciones generales
                    </label>
                    <Textarea
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      placeholder="Ej: Historial clínico inicial, antecedentes, alergias conocidas..."
                      className="min-h-[140px] rounded-2xl border-slate-300 text-base focus-visible:ring-violet-500"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-4 border-t border-slate-200 bg-white px-8 py-5 md:px-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-2xl border-violet-500 px-6 text-lg font-semibold text-violet-600 hover:bg-violet-50"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-2xl bg-orange-500 px-6 text-lg font-semibold text-white hover:bg-orange-600"
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}