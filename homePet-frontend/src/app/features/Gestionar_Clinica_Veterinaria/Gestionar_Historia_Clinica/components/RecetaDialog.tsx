import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  useCreateRecetaMutation,
  useUpdateRecetaMutation,
  type Receta,
} from "../store"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  idConsultaClinica: number | null
  modo?: "crear" | "editar"
  recetaInicial?: Receta | null
}

interface FormState {
  fecha: string
  indicaciones: string
  observacion: string
}

function getCurrentDateTimeLocal() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return getCurrentDateTimeLocal()
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return getCurrentDateTimeLocal()

  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

const initialForm: FormState = {
  fecha: getCurrentDateTimeLocal(),
  indicaciones: "",
  observacion: "",
}

export function RecetaDialog({
  open,
  onOpenChange,
  idConsultaClinica,
  modo = "crear",
  recetaInicial = null,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [error, setError] = useState("")

  const [createReceta, { isLoading: isCreating }] = useCreateRecetaMutation()
  const [updateReceta, { isLoading: isUpdating }] = useUpdateRecetaMutation()

  const isEditing = modo === "editar"
  const isLoading = isCreating || isUpdating

  useEffect(() => {
    if (!open) return

    setError("")

    if (isEditing && recetaInicial) {
      setForm({
        fecha: toDateTimeLocal(recetaInicial.fecha),
        indicaciones: recetaInicial.indicaciones ?? "",
        observacion: recetaInicial.observacion ?? "",
      })
    } else {
      setForm({
        fecha: getCurrentDateTimeLocal(),
        indicaciones: "",
        observacion: "",
      })
    }
  }, [open, isEditing, recetaInicial])

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isEditing) {
      if (!recetaInicial?.id_receta) {
        setError("No se encontró la receta a editar.")
        return
      }
    } else {
      if (!idConsultaClinica) {
        setError("No se encontró la consulta clínica.")
        return
      }
    }

    if (!form.fecha) {
      setError("Debes ingresar la fecha.")
      return
    }

    if (!form.indicaciones.trim()) {
      setError("Debes ingresar las indicaciones.")
      return
    }

    const payload = {
      consulta_clinica: idConsultaClinica,
      fecha: new Date(form.fecha).toISOString(),
      indicaciones: form.indicaciones.trim(),
      observacion: form.observacion.trim() || null,
    }

    try {
      if (isEditing) {
        await updateReceta({
          idReceta: recetaInicial!.id_receta,
          body: payload,
        }).unwrap()
      } else {
        await createReceta({
          idConsultaClinica: idConsultaClinica!,
          body: payload,
        }).unwrap()
      }

      onOpenChange(false)
      setForm(initialForm)
    } catch (err: any) {
      console.error(err)

      if (err?.data) {
        const backendError =
          typeof err.data === "string"
            ? err.data
            : JSON.stringify(err.data)

        setError(
          isEditing
            ? `No se pudo actualizar la receta. ${backendError}`
            : `No se pudo registrar la receta. ${backendError}`
        )
      } else {
        setError(
          isEditing
            ? "No se pudo actualizar la receta."
            : "No se pudo registrar la receta."
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[95vw] sm:!max-w-[920px] overflow-hidden rounded-[30px] border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogTitle className="sr-only">
          {isEditing ? "Editar receta" : "Nueva receta"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Formulario para registrar o editar una receta clínica.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="flex max-h-[88vh] flex-col">
          <div className="bg-gradient-to-r from-violet-700 via-violet-500 to-violet-400 px-8 py-7 text-white md:px-10">
            <div className="pr-10">
              <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
                {isEditing ? "Editar receta" : "Nueva receta"}
              </h2>
              <p className="mt-2 text-base text-white/90 md:text-xl">
                {isEditing
                  ? "Actualiza la receta de esta consulta clínica."
                  : "Registra la receta de esta consulta clínica."}
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
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Fecha
                    </label>
                    <Input
                      type="datetime-local"
                      name="fecha"
                      value={form.fecha}
                      onChange={handleChange}
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Indicaciones
                    </label>
                    <Textarea
                      name="indicaciones"
                      value={form.indicaciones}
                      onChange={handleChange}
                      placeholder="Ej: Administrar medicamento cada 8 horas..."
                      className="mt-2 min-h-[150px] rounded-2xl border-slate-300 text-base"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Observación
                    </label>
                    <Textarea
                      name="observacion"
                      value={form.observacion}
                      onChange={handleChange}
                      placeholder="Ej: Control en 5 días..."
                      className="mt-2 min-h-[120px] rounded-2xl border-slate-300 text-base"
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
                {isLoading
                  ? isEditing
                    ? "Actualizando..."
                    : "Guardando..."
                  : isEditing
                    ? "Guardar cambios"
                    : "Guardar receta"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}