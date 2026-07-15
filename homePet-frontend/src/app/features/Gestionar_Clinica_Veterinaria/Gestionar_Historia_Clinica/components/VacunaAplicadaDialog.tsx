import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  useCreateVacunaAplicadaMutation,
  useUpdateVacunaAplicadaMutation,
  type ConsultaClinica,
  type VacunaAplicada,
} from "../store"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  consulta?: ConsultaClinica | null
  idConsultaClinica?: number | null
  modo?: "crear" | "editar"
  vacunaInicial?: VacunaAplicada | null
}

interface FormState {
  nombre_vacuna: string
  dosis: string
  fecha_aplicada: string
  fecha_proxima: string
  observacion: string
  lote: string
  fabricante: string
  estado_vacuna: string
}

const initialForm: FormState = {
  nombre_vacuna: "",
  dosis: "",
  fecha_aplicada: "",
  fecha_proxima: "",
  observacion: "",
  lote: "",
  fabricante: "",
  estado_vacuna: "APLICADA",
}

function toInputDate(value?: string | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().split("T")[0]
}

export function VacunaAplicadaDialog({
  open,
  onOpenChange,
  consulta = null,
  idConsultaClinica = null,
  modo = "crear",
  vacunaInicial = null,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [error, setError] = useState("")

  const [createVacunaAplicada, { isLoading: isCreating }] =
    useCreateVacunaAplicadaMutation()

  const [updateVacunaAplicada, { isLoading: isUpdating }] =
    useUpdateVacunaAplicadaMutation()

  const isEditing = modo === "editar"
  const isLoading = isCreating || isUpdating
  const consultaId = idConsultaClinica ?? consulta?.id_consulta_clinica ?? null

  useEffect(() => {
    if (!open) return

    setError("")

    if (isEditing && vacunaInicial) {
      setForm({
        nombre_vacuna: vacunaInicial.nombre_vacuna ?? "",
        dosis: vacunaInicial.dosis ?? "",
        fecha_aplicada: toInputDate(vacunaInicial.fecha_aplicada),
        fecha_proxima: toInputDate(vacunaInicial.fecha_proxima),
        observacion: vacunaInicial.observacion ?? "",
        lote: vacunaInicial.lote ?? "",
        fabricante: vacunaInicial.fabricante ?? "",
        estado_vacuna: vacunaInicial.estado_vacuna ?? "APLICADA",
      })
    } else {
      setForm(initialForm)
    }
  }, [open, isEditing, vacunaInicial])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      if (!vacunaInicial?.id_vacuna_aplicada) {
        setError("No se encontró la vacuna a editar.")
        return
      }
    } else {
      if (!consultaId) {
        setError("No se encontró la consulta clínica.")
        return
      }
    }

    if (!form.nombre_vacuna.trim()) {
      setError("Debes ingresar el nombre de la vacuna.")
      return
    }

    if (!form.fecha_aplicada) {
      setError("Debes ingresar la fecha aplicada.")
      return
    }

    if (form.fecha_proxima && form.fecha_proxima < form.fecha_aplicada) {
      setError("La próxima fecha no puede ser menor a la fecha aplicada.")
      return
    }

    const payload = {
      consulta_clinica: consultaId,
      nombre_vacuna: form.nombre_vacuna.trim(),
      dosis: form.dosis.trim() || null,
      fecha_aplicada: form.fecha_aplicada,
      fecha_proxima: form.fecha_proxima || null,
      observacion: form.observacion.trim() || null,
      lote: form.lote.trim() || null,
      fabricante: form.fabricante.trim() || null,
      estado_vacuna: form.estado_vacuna || null,
    }

    try {
      if (isEditing) {
        await updateVacunaAplicada({
          idVacunaAplicada: vacunaInicial!.id_vacuna_aplicada,
          body: payload,
        }).unwrap()
      } else {
        await createVacunaAplicada({
          idConsultaClinica: consultaId!,
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
            ? `No se pudo actualizar la vacuna. ${backendError}`
            : `No se pudo registrar la vacuna. ${backendError}`
        )
      } else {
        setError(
          isEditing
            ? "No se pudo actualizar la vacuna."
            : "No se pudo registrar la vacuna."
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[95vw] sm:!max-w-[960px] overflow-hidden rounded-[30px] border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogTitle className="sr-only">
          {isEditing ? "Editar vacuna aplicada" : "Nueva vacuna aplicada"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Formulario para registrar o editar una vacuna aplicada.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="flex max-h-[88vh] flex-col">
          <div className="bg-gradient-to-r from-violet-700 via-violet-500 to-violet-400 px-8 py-7 text-white md:px-10">
            <div className="pr-10">
              <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
                {isEditing ? "Editar vacuna aplicada" : "Nueva vacuna aplicada"}
              </h2>
              <p className="mt-2 text-base text-white/90 md:text-xl">
                {isEditing
                  ? "Actualiza la información completa de la vacuna."
                  : "Registra la información completa de la vacuna aplicada."}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 px-8 py-7 md:px-10">
            <div className="space-y-6">
              {consulta && (
                <section className="rounded-3xl border border-violet-200 bg-violet-50/80 p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                    Consulta seleccionada
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {consulta.mascota_nombre || "Mascota"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Veterinario: {consulta.veterinario_nombre || "No registrado"}
                  </p>
                </section>
              )}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Nombre de vacuna
                    </label>
                    <Input
                      name="nombre_vacuna"
                      value={form.nombre_vacuna}
                      onChange={handleChange}
                      placeholder="Ej: Antirrábica"
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Dosis
                    </label>
                    <Input
                      name="dosis"
                      value={form.dosis}
                      onChange={handleChange}
                      placeholder="Ej: 1 ml"
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Estado de vacuna
                    </label>
                    <select
                      name="estado_vacuna"
                      value={form.estado_vacuna}
                      onChange={handleChange}
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-800 outline-none"
                    >
                      <option value="APLICADA">APLICADA</option>
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="VENCIDA">VENCIDA</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Fecha aplicada
                    </label>
                    <Input
                      type="date"
                      name="fecha_aplicada"
                      value={form.fecha_aplicada}
                      onChange={handleChange}
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Próxima fecha
                    </label>
                    <Input
                      type="date"
                      name="fecha_proxima"
                      value={form.fecha_proxima}
                      onChange={handleChange}
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Lote
                    </label>
                    <Input
                      name="lote"
                      value={form.lote}
                      onChange={handleChange}
                      placeholder="Ej: AR-2026-001"
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Fabricante
                    </label>
                    <Input
                      name="fabricante"
                      value={form.fabricante}
                      onChange={handleChange}
                      placeholder="Ej: VetPharma"
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Observación
                    </label>
                    <Textarea
                      name="observacion"
                      value={form.observacion}
                      onChange={handleChange}
                      placeholder="Ej: Aplicada sin complicaciones..."
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
                    : "Guardar vacuna"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}