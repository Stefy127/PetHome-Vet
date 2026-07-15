import { useEffect, useMemo, useState } from "react"
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
  useCreateArchivoClinicoMutation,
  useUpdateArchivoClinicoMutation,
  type ArchivoClinico,
  type ConsultaClinica,
} from "../store"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  consulta: ConsultaClinica | null
  modo?: "crear" | "editar"
  archivoInicial?: ArchivoClinico | null
}

interface FormState {
  nombre_archivo: string
  tipo_archivo: "IMAGEN" | "PDF" | "WORD" | "OTRO"
  descripcion: string
  estado: boolean
  archivo: File | null
}

const initialForm: FormState = {
  nombre_archivo: "",
  tipo_archivo: "OTRO",
  descripcion: "",
  estado: true,
  archivo: null,
}

function formatBytes(bytes?: number | null) {
  if (!bytes) return "No registrado"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function inferTipoArchivo(filename?: string | null): FormState["tipo_archivo"] {
  if (!filename) return "OTRO"
  const ext = filename.split(".").pop()?.toLowerCase()

  if (!ext) return "OTRO"
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext)) return "IMAGEN"
  if (ext === "pdf") return "PDF"
  if (["doc", "docx"].includes(ext)) return "WORD"
  return "OTRO"
}

export function ArchivoClinicoDialog({
  open,
  onOpenChange,
  consulta,
  modo = "crear",
  archivoInicial = null,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [error, setError] = useState("")

  const [createArchivoClinico, { isLoading: isCreating }] =
    useCreateArchivoClinicoMutation()

  const [updateArchivoClinico, { isLoading: isUpdating }] =
    useUpdateArchivoClinicoMutation()

  const isEditing = modo === "editar"
  const isLoading = isCreating || isUpdating

  useEffect(() => {
    if (!open) return

    setError("")

    if (isEditing && archivoInicial) {
      setForm({
        nombre_archivo: archivoInicial.nombre_archivo ?? "",
        tipo_archivo:
          (archivoInicial.tipo_archivo as FormState["tipo_archivo"]) ?? "OTRO",
        descripcion: archivoInicial.descripcion ?? "",
        estado: archivoInicial.estado ?? true,
        archivo: null,
      })
    } else {
      setForm(initialForm)
    }
  }, [open, isEditing, archivoInicial])

  const archivoActualNombre = useMemo(() => {
    if (form.archivo) return form.archivo.name
    return archivoInicial?.nombre_archivo ?? "Sin archivo"
  }, [form.archivo, archivoInicial])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "estado") {
      setForm((prev) => ({
        ...prev,
        estado: value === "true",
      }))
      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null

    setForm((prev) => ({
      ...prev,
      archivo: file,
      nombre_archivo: file ? prev.nombre_archivo || file.name : prev.nombre_archivo,
      tipo_archivo: file ? inferTipoArchivo(file.name) : prev.tipo_archivo,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!consulta?.id_consulta_clinica && !archivoInicial?.consulta_clinica) {
      setError("No se encontró la consulta clínica.")
      return
    }

    if (!form.nombre_archivo.trim()) {
      setError("Debes ingresar el nombre del archivo.")
      return
    }

    if (!isEditing && !form.archivo) {
      setError("Debes seleccionar un archivo.")
      return
    }

    const body = {
      consulta_clinica:
        consulta?.id_consulta_clinica ?? archivoInicial?.consulta_clinica ?? null,
      nombre_archivo: form.nombre_archivo.trim(),
      archivo: form.archivo,
      tipo_archivo: form.tipo_archivo,
      descripcion: form.descripcion.trim() || null,
      estado: form.estado,
    }

    try {
      if (isEditing) {
        if (!archivoInicial?.id_archivo_clinico) {
          setError("No se encontró el archivo clínico a editar.")
          return
        }

        await updateArchivoClinico({
          idArchivoClinico: archivoInicial.id_archivo_clinico,
          body,
        }).unwrap()
      } else {
        await createArchivoClinico({
          idConsultaClinica: consulta!.id_consulta_clinica,
          body,
        }).unwrap()
      }

      onOpenChange(false)
      setForm(initialForm)
    } catch (err: any) {
      console.error(err)

      if (err?.data) {
        const backendError =
          typeof err.data === "string" ? err.data : JSON.stringify(err.data)

        setError(
          isEditing
            ? `No se pudo actualizar el archivo clínico. ${backendError}`
            : `No se pudo registrar el archivo clínico. ${backendError}`
        )
      } else {
        setError(
          isEditing
            ? "No se pudo actualizar el archivo clínico."
            : "No se pudo registrar el archivo clínico."
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[95vw] sm:!max-w-[980px] overflow-hidden rounded-[30px] border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogTitle className="sr-only">
          {isEditing ? "Editar archivo clínico" : "Nuevo archivo clínico"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Formulario para registrar o editar un archivo clínico.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="flex max-h-[88vh] flex-col">
          <div className="bg-gradient-to-r from-violet-700 via-violet-500 to-violet-400 px-8 py-7 text-white md:px-10">
            <div className="pr-10">
              <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
                {isEditing ? "Editar archivo clínico" : "Nuevo archivo clínico"}
              </h2>
              <p className="mt-2 text-base text-white/90 md:text-xl">
                {isEditing
                  ? "Actualiza la información del archivo clínico."
                  : "Adjunta un nuevo archivo clínico a la consulta."}
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
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {consulta.mascota_nombre || "Mascota sin nombre"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Veterinario: {consulta.veterinario_nombre || "Sin veterinario"}
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
                      Nombre del archivo
                    </label>
                    <Input
                      name="nombre_archivo"
                      value={form.nombre_archivo}
                      onChange={handleChange}
                      placeholder="Ej: Radiografía abdominal"
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Tipo de archivo
                    </label>
                    <select
                      name="tipo_archivo"
                      value={form.tipo_archivo}
                      onChange={handleChange}
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-800 outline-none"
                    >
                      <option value="IMAGEN">Imagen</option>
                      <option value="PDF">PDF</option>
                      <option value="WORD">Word</option>
                      <option value="OTRO">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={String(form.estado)}
                      onChange={handleChange}
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-800 outline-none"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Archivo
                    </label>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      className="mt-2 rounded-2xl border-slate-300"
                    />
                    <p className="mt-2 text-sm text-slate-500">
                      {isEditing
                        ? "Si seleccionas un archivo nuevo, reemplazará el actual."
                        : "Selecciona el archivo que deseas adjuntar."}
                    </p>
                  </div>

                  <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">
                        Archivo actual:
                      </span>{" "}
                      {archivoActualNombre}
                    </p>

                    {archivoInicial && (
                      <>
                        <p className="mt-1 text-sm text-slate-600">
                          <span className="font-semibold text-slate-900">
                            Extensión:
                          </span>{" "}
                          {archivoInicial.extension || "No registrada"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          <span className="font-semibold text-slate-900">
                            Tamaño:
                          </span>{" "}
                          {formatBytes(archivoInicial.tamano_bytes)}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          <span className="font-semibold text-slate-900">
                            Fecha de subida:
                          </span>{" "}
                          {archivoInicial.fecha_subida || "No registrada"}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Descripción
                    </label>
                    <Textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      placeholder="Ej: Control posterior a tratamiento..."
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
                    : "Guardar archivo"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}