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
  useCreateDetalleRecetaMutation,
  useUpdateDetalleRecetaMutation,
  useGetProductosRecetaQuery,
  type DetalleReceta,
  type Receta,
} from "../store"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  receta?: Receta | null
  idReceta?: number | null
  modo?: "crear" | "editar"
  detalleInicial?: DetalleReceta | null
}

interface FormState {
  medicamento: string
  dosis: string
  frecuencia: string
  duracion_dias: string
  indicaciones_adicionales: string
  id_producto: string
}

const initialForm: FormState = {
  medicamento: "",
  dosis: "",
  frecuencia: "",
  duracion_dias: "",
  indicaciones_adicionales: "",
  id_producto: "",
}

export function DetalleRecetaDialog({
  open,
  onOpenChange,
  receta = null,
  idReceta = null,
  modo = "crear",
  detalleInicial = null,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [error, setError] = useState("")

  const [createDetalleReceta, { isLoading: isCreating }] =
    useCreateDetalleRecetaMutation()

  const [updateDetalleReceta, { isLoading: isUpdating }] =
    useUpdateDetalleRecetaMutation()

  const { data: productos = [], isLoading: loadingProductos } =
    useGetProductosRecetaQuery()

  const isEditing = modo === "editar"
  const isLoading = isCreating || isUpdating
  const recetaId = idReceta ?? receta?.id_receta ?? null

  useEffect(() => {
    if (!open) return

    setError("")

    if (isEditing && detalleInicial) {
      setForm({
        medicamento: detalleInicial.medicamento ?? "",
        dosis: detalleInicial.dosis ?? "",
        frecuencia: detalleInicial.frecuencia ?? "",
        duracion_dias:
          detalleInicial.duracion_dias !== null &&
          detalleInicial.duracion_dias !== undefined
            ? String(detalleInicial.duracion_dias)
            : "",
        indicaciones_adicionales:
          detalleInicial.indicaciones_adicionales ?? "",
        id_producto:
          detalleInicial.id_producto !== null &&
          detalleInicial.id_producto !== undefined
            ? String(detalleInicial.id_producto)
            : "",
      })
    } else {
      setForm(initialForm)
    }
  }, [open, isEditing, detalleInicial])

  const productoSeleccionado = useMemo(() => {
    if (!form.id_producto) return null
    return productos.find(
      (p: any) => String(p.id_producto) === String(form.id_producto)
    )
  }, [form.id_producto, productos])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProductoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value

    if (!selectedId) {
      setForm((prev) => ({
        ...prev,
        id_producto: "",
      }))
      return
    }

    const producto = productos.find(
      (p: any) => String(p.id_producto) === String(selectedId)
    )

    setForm((prev) => ({
      ...prev,
      id_producto: selectedId,
      medicamento:
        prev.medicamento.trim() === "" && producto?.nombre
          ? producto.nombre
          : prev.medicamento,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isEditing) {
      if (!detalleInicial?.id_detalle_receta) {
        setError("No se encontró el detalle de receta a editar.")
        return
      }
    } else {
      if (!recetaId) {
        setError("No se encontró la receta.")
        return
      }
    }

    if (!form.medicamento.trim()) {
      setError("Debes ingresar el medicamento.")
      return
    }

    if (!form.dosis.trim()) {
      setError("Debes ingresar la dosis.")
      return
    }

    if (!form.frecuencia.trim()) {
      setError("Debes ingresar la frecuencia.")
      return
    }

    const duracionDias =
      form.duracion_dias.trim() === ""
        ? null
        : Number(form.duracion_dias)

    if (
      form.duracion_dias.trim() !== "" &&
      (Number.isNaN(duracionDias) || duracionDias! < 0)
    ) {
      setError("La duración en días debe ser un número válido.")
      return
    }

    const idProducto =
      form.id_producto.trim() === ""
        ? null
        : Number(form.id_producto)

    if (
      form.id_producto.trim() !== "" &&
      (Number.isNaN(idProducto) || idProducto! <= 0)
    ) {
      setError("El producto seleccionado no es válido.")
      return
    }

    const payload = {
      receta: recetaId,
      medicamento: form.medicamento.trim(),
      dosis: form.dosis.trim(),
      frecuencia: form.frecuencia.trim(),
      duracion_dias: duracionDias,
      indicaciones_adicionales:
        form.indicaciones_adicionales.trim() || null,
      id_producto: idProducto,
    }

    try {
      if (isEditing) {
        await updateDetalleReceta({
          idDetalleReceta: detalleInicial!.id_detalle_receta,
          body: payload,
        }).unwrap()
      } else {
        await createDetalleReceta({
          idReceta: recetaId!,
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
            ? `No se pudo actualizar el detalle de receta. ${backendError}`
            : `No se pudo registrar el detalle de receta. ${backendError}`
        )
      } else {
        setError(
          isEditing
            ? "No se pudo actualizar el detalle de receta."
            : "No se pudo registrar el detalle de receta."
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[95vw] sm:!max-w-[960px] overflow-hidden rounded-[30px] border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogTitle className="sr-only">
          {isEditing ? "Editar detalle de receta" : "Nuevo detalle de receta"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Formulario para registrar o editar un detalle de receta.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="flex max-h-[88vh] flex-col">
          <div className="bg-gradient-to-r from-violet-700 via-violet-500 to-violet-400 px-8 py-7 text-white md:px-10">
            <div className="pr-10">
              <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
                {isEditing
                  ? "Editar detalle de receta"
                  : "Nuevo detalle de receta"}
              </h2>
              <p className="mt-2 text-base text-white/90 md:text-xl">
                {isEditing
                  ? "Actualiza la información del medicamento recetado."
                  : "Registra la información del medicamento recetado."}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 px-8 py-7 md:px-10">
            <div className="space-y-6">
              {receta && (
                <section className="rounded-3xl border border-violet-200 bg-violet-50/80 p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                    Receta seleccionada
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {receta.indicaciones || "Receta"}
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
                      Producto interno
                    </label>
                   <select
                     name="id_producto"
                    value={form.id_producto}
                    onChange={handleProductoChange}
                     className="mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-800 outline-none"
                   >
                    <option value="">Sin producto asociado</option>
                    {productos.map((producto: any) => (
                        <option
                  key={producto.id_producto}
                 value={producto.id_producto}
                    >
                  {producto.nombre || `Producto #${producto.id_producto}`}
                 {producto.unidad_medida ? ` (${producto.unidad_medida})` : ""}
             </option>
        ))}
        </select>

                    {loadingProductos && (
                      <p className="mt-2 text-sm text-slate-500">
                        Cargando productos...
                      </p>
                    )}

                  {productoSeleccionado && (
                        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                         <p>
                        <span className="font-semibold text-slate-800">Producto:</span>{" "}
                     {productoSeleccionado.nombre || "Sin nombre"}
                        </p>
                        <p>
                       <span className="font-semibold text-slate-800">Unidad:</span>{" "}
                     {productoSeleccionado.unidad_medida || "No registrada"}
                     </p>
                         <p>
                     <span className="font-semibold text-slate-800">Precio venta:</span>{" "}
                     {productoSeleccionado.precio_venta ?? "No registrado"}
                   </p>
             </div>
)}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Medicamento
                    </label>
                    <Input
                      name="medicamento"
                      value={form.medicamento}
                      onChange={handleChange}
                      placeholder="Ej: Antialérgico"
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                    <p className="mt-2 text-sm text-slate-500">
                      Puedes escribirlo manualmente aunque no exista como producto interno.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Dosis
                    </label>
                    <Input
                      name="dosis"
                      value={form.dosis}
                      onChange={handleChange}
                      placeholder="Ej: 5 ml"
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Frecuencia
                    </label>
                    <Input
                      name="frecuencia"
                      value={form.frecuencia}
                      onChange={handleChange}
                      placeholder="Ej: cada 8 horas"
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Duración (días)
                    </label>
                    <Input
                      type="number"
                      name="duracion_dias"
                      value={form.duracion_dias}
                      onChange={handleChange}
                      placeholder="Ej: 5"
                      className="mt-2 h-12 rounded-2xl border-slate-300"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Indicaciones adicionales
                    </label>
                    <Textarea
                      name="indicaciones_adicionales"
                      value={form.indicaciones_adicionales}
                      onChange={handleChange}
                      placeholder="Ej: Dar después de las comidas..."
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
                    : "Guardar detalle"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}