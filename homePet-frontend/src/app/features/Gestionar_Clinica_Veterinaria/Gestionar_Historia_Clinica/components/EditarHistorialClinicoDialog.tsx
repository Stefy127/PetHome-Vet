import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateClinicalHistoryMutation, type ClinicalHistory } from "../store"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  historial: ClinicalHistory | null
}

export function EditarHistorialClinicoDialog({
  open,
  onOpenChange,
  historial,
}: Props) {
  const [observaciones, setObservaciones] = useState("")
  const [error, setError] = useState("")

  const [updateClinicalHistory, { isLoading }] =
    useUpdateClinicalHistoryMutation()

  useEffect(() => {
    if (open && historial) {
      setObservaciones(historial.observaciones_generales ?? "")
      setError("")
    }
  }, [open, historial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!historial?.id_historial_clinico) {
      setError("No se encontró el historial clínico.")
      return
    }

    try {
      await updateClinicalHistory({
        idHistorialClinico: historial.id_historial_clinico,
        body: {
          observaciones_generales: observaciones.trim(),
        },
      }).unwrap()

      onOpenChange(false)
    } catch (err: any) {
      console.error(err)

      if (err?.data) {
        const backendError =
          typeof err.data === "string"
            ? err.data
            : JSON.stringify(err.data)
        setError(`No se pudo actualizar el historial. ${backendError}`)
      } else {
        setError("No se pudo actualizar el historial clínico.")
      }
    }
  }

  if (!historial) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[95vw] sm:!max-w-[980px] overflow-hidden rounded-[30px] border border-slate-200 bg-white p-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex max-h-[88vh] flex-col">
          <div className="bg-gradient-to-r from-violet-700 via-violet-500 to-violet-400 px-8 py-7 text-white md:px-10">
            <div className="pr-10">
              <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
                Editar historial clínico
              </h2>
              <p className="mt-2 text-base text-white/90 md:text-xl">
                Actualiza la información general del historial.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 px-8 py-7 md:px-10">
            <div className="space-y-6">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Mascota
                    </p>
                    <Input
                      value={historial.mascota_nombre || ""}
                      readOnly
                      className="mt-2 h-12 rounded-2xl border-slate-300 bg-slate-50"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Propietario
                    </p>
                    <Input
                      value={historial.propietario_nombre || ""}
                      readOnly
                      className="mt-2 h-12 rounded-2xl border-slate-300 bg-slate-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Observaciones generales
                    </p>
                    <Textarea
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      placeholder="Ej: antecedentes, alergias conocidas, observaciones permanentes..."
                      className="mt-2 min-h-[160px] rounded-2xl border-slate-300 text-base"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white px-8 py-5 md:px-10">
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
              >
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}