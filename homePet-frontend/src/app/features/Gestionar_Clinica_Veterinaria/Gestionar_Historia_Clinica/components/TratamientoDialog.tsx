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
  useCreateTratamientoMutation,
  useUpdateTratamientoMutation,
  type ConsultaClinica,
  type Tratamiento,
} from "../store"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  consulta?: ConsultaClinica | null
  idConsultaClinica?: number | null
  modo?: "crear" | "editar"
  tratamientoInicial?: Tratamiento | null
}

interface FormState {
  tipo: string
  descripcion: string
  fecha_ini: string
  fecha_fin: string
  observacion: string
  estado_tratamiento: string
}

const initialForm: FormState = {
  tipo: "MEDICAMENTO",
  descripcion: "",
  fecha_ini: "",
  fecha_fin: "",
  observacion: "",
  estado_tratamiento: "EN_CURSO",
}

function toInputDate(value?: string | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().split("T")[0]
}

export function TratamientoDialog({
  open,
  onOpenChange,
  consulta = null,
  idConsultaClinica = null,
  modo = "crear",
  tratamientoInicial = null,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [error, setError] = useState("")

  const [createTratamiento, { isLoading: isCreating }] =
    useCreateTratamientoMutation()

  const [updateTratamiento, { isLoading: isUpdating }] =
    useUpdateTratamientoMutation()

  const isEditing = modo === "editar"
  const isLoading = isCreating || isUpdating
  const consultaId = idConsultaClinica ?? consulta?.id_consulta_clinica ?? null

  useEffect(() => {
    if (!open) return

    setError("")

    if (isEditing && tratamientoInicial) {
      setForm({
        tipo: tratamientoInicial.tipo ?? "MEDICAMENTO",
        descripcion: tratamientoInicial.descripcion ?? "",
        fecha_ini: toInputDate(tratamientoInicial.fecha_ini),
        fecha_fin: toInputDate(tratamientoInicial.fecha_fin),
        observacion: tratamientoInicial.observacion ?? "",
        estado_tratamiento:
          tratamientoInicial.estado_tratamiento ?? "EN_CURSO",
      })
    } else {
      setForm(initialForm)
    }
  }, [open, isEditing, tratamientoInicial])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      if (!tratamientoInicial?.id_tratamiento) {
        setError("No se encontró el tratamiento a editar.")
        return
      }
    } else {
      if (!consultaId) {
        setError("No se encontró la consulta clínica.")
        return
      }
    }

    if (!form.descripcion.trim()) {
      setError("Debes ingresar la descripción del tratamiento.")
      return
    }

    if (form.fecha_ini && form.fecha_fin && form.fecha_fin < form.fecha_ini) {
      setError("La fecha de fin no puede ser menor a la fecha de inicio.")
      return
    }

    const payload = {
      consulta_clinica: consultaId,
      tipo: form.tipo,
      descripcion: form.descripcion.trim(),
      fecha_ini: form.fecha_ini || null,
      fecha_fin: form.fecha_fin || null,
      observacion: form.observacion.trim() || null,
      estado_tratamiento: form.estado_tratamiento || null,
    }

    try {
      if (isEditing) {
        await updateTratamiento({
          idTratamiento: tratamientoInicial!.id_tratamiento,
          body: payload,
        }).unwrap()
      } else {
        await createTratamiento({
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
            ? `No se pudo actualizar el tratamiento. ${backendError}`
            : `No se pudo registrar el tratamiento. ${backendError}`
        )
      } else {
        setError(
          isEditing
            ? "No se pudo actualizar el tratamiento."
            : "No se pudo registrar el tratamiento."
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[95vw] sm:!max-w-[960px] overflow-hidden rounded-[30px] border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogTitle className="sr-only">
          {isEditing ? "Editar tratamiento" : "Nuevo tratamiento"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Formulario para registrar o editar un tratamiento clínico.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="flex max-h-[88vh] flex-col">
          <div className="bg-gradient-to-r from-violet-700 via-violet-500 to-violet-400 px-8 py-7 text-white md:px-10">
            <div className="pr-10">
              <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
                {isEditing ? "Editar tratamiento" : "Nuevo tratamiento"}
              </h2>
              <p className="mt-2 text-base text-white/90 md:text-xl">
                {isEditing
                  ? "Actualiza toda la información del tratamiento."
                  : "Registra toda la información del tratamiento."}
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
                      Tipo de tratamiento
                    </label>
                    <select
                      name="tipo"
                      value={form.tipo}
                      onChange={handleChange}
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-800 outline-none"
                    >
                      <option value="MEDICAMENTO">MEDICAMENTO</option>
                      <option value="TERAPIA">TERAPIA</option>
                      <option value="CIRUGIA">CIRUGIA</option>
                      <option value="CURACION">CURACION</option>
                      <option value="OTRO">OTRO</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Descripción
                    </label>
                    <Textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      placeholder="Describe el tratamiento..."
                      className="mt-2 min-h-[120px] rounded-2xl border-slate-300 text-base"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Fecha de inicio
                    </label>
                    <Input
                      type="date"
                      name="fecha_ini"
                      value={form.fecha_ini}
                      onChange={handleChange}
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Fecha de fin
                    </label>
                    <Input
                      type="date"
                      name="fecha_fin"
                      value={form.fecha_fin}
                      onChange={handleChange}
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
                      placeholder="Ej: Debe darle las gotas cada 8 horas..."
                      className="mt-2 min-h-[110px] rounded-2xl border-slate-300 text-base"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Estado del tratamiento
                    </label>
                    <select
                      name="estado_tratamiento"
                      value={form.estado_tratamiento}
                      onChange={handleChange}
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-800 outline-none"
                    >
                      <option value="EN_CURSO">EN_CURSO</option>
                      <option value="COMPLETADO">COMPLETADO</option>
                      <option value="SUSPENDIDO">SUSPENDIDO</option>
                    </select>
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
                    : "Guardar tratamiento"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}