import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import type {
  ClienteVentaOption,
  MascotaVentaOption,
  PrecioServicioOption,
  ProductoVentaOption,
  ServicioOption,
  VentaCreatePayload,
  VentaFormValues,
} from '../types/ventas.types'
import { formatCurrencyBs } from '../utils/ventasFormatters'
import { buildVentaCreatePayload, hasServiceInDetails, validateVentaForm } from '../utils/ventasValidators'
import { VentaResumenCard } from './VentaResumenCard'

type VentaFormProps = {
  clientes: ClienteVentaOption[]
  mascotas: MascotaVentaOption[]
  productos: ProductoVentaOption[]
  servicios: ServicioOption[]
  preciosServicio: PrecioServicioOption[]
  isSubmitting: boolean
  onSubmit: (payload: VentaCreatePayload, context: { hasProducts: boolean }) => Promise<void>
}

function createDraftDetail() {
  return {
    uid: `${Date.now()}-${Math.round(Math.random() * 100_000)}`,
    tipo_item: 'PRODUCTO' as const,
    producto: '',
    servicio: '',
    precio_servicio: '',
    cantidad: '1',
  }
}

function toPositiveInt(value: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0
}

export function VentaForm({
  clientes,
  mascotas,
  productos,
  servicios,
  preciosServicio,
  isSubmitting,
  onSubmit,
}: VentaFormProps) {
  const [values, setValues] = useState<VentaFormValues>({
    cliente: '',
    mascota: '',
    observacion: '',
    detalles: [createDraftDetail()],
  })
  const [errors, setErrors] = useState<string[]>([])

  const selectedClient = useMemo(
    () => clientes.find((option) => String(option.id) === values.cliente),
    [clientes, values.cliente],
  )

  const visibleMascotas = useMemo(() => {
    if (!selectedClient?.userId) return mascotas
    const filtered = mascotas.filter((option) => option.ownerUserId === selectedClient.userId)
    return filtered.length ? filtered : mascotas
  }, [mascotas, selectedClient])

  const pricesByService = useMemo(() => {
    const map = new Map<number, PrecioServicioOption[]>()
    preciosServicio.forEach((option) => {
      const row = map.get(option.servicioId) ?? []
      row.push(option)
      map.set(option.servicioId, row)
    })
    return map
  }, [preciosServicio])

  const estimatedTotal = useMemo(() => {
    const productosMap = new Map(productos.map((item) => [item.id, item.unitPrice]))
    const preciosMap = new Map(preciosServicio.map((item) => [item.id, item.unitPrice]))

    return values.detalles.reduce((acc, detail) => {
      const cantidad = toPositiveInt(detail.cantidad)
      if (detail.tipo_item === 'PRODUCTO') {
        const unit = productosMap.get(toPositiveInt(detail.producto)) ?? 0
        return acc + unit * cantidad
      }
      if (detail.tipo_item === 'SERVICIO') {
        const unit = preciosMap.get(toPositiveInt(detail.precio_servicio)) ?? 0
        return acc + unit * cantidad
      }
      return acc
    }, 0)
  }, [preciosServicio, productos, values.detalles])

  const mascotaRequired = hasServiceInDetails(values)
  const hasProducts = values.detalles.some((detail) => detail.tipo_item === 'PRODUCTO')

  const updateDetail = (
    uid: string,
    field: 'tipo_item' | 'producto' | 'servicio' | 'precio_servicio' | 'cantidad',
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      detalles: prev.detalles.map((detail) => {
        if (detail.uid !== uid) return detail

        if (field === 'tipo_item' && value === 'PRODUCTO') {
          return {
            ...detail,
            tipo_item: 'PRODUCTO',
            producto: '',
            servicio: '',
            precio_servicio: '',
            cantidad: detail.cantidad || '1',
          }
        }

        if (field === 'tipo_item' && value === 'SERVICIO') {
          return {
            ...detail,
            tipo_item: 'SERVICIO',
            producto: '',
            servicio: '',
            precio_servicio: '',
            cantidad: '1',
          }
        }

        if (field === 'servicio') {
          return {
            ...detail,
            servicio: value,
            precio_servicio: '',
          }
        }

        return {
          ...detail,
          [field]: value,
        }
      }),
    }))
  }

  const addDetail = () => {
    setValues((prev) => ({
      ...prev,
      detalles: [...prev.detalles, createDraftDetail()],
    }))
  }

  const removeDetail = (uid: string) => {
    setValues((prev) => {
      const next = prev.detalles.filter((detail) => detail.uid !== uid)
      return {
        ...prev,
        detalles: next.length ? next : [createDraftDetail()],
      }
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const validationErrors = validateVentaForm(values)
    setErrors(validationErrors)
    if (validationErrors.length > 0) return

    await onSubmit(buildVentaCreatePayload(values), { hasProducts })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card className="border-violet-200">
        <CardContent className="space-y-5 p-5">
          <div>
            <h2 className="text-2xl font-bold text-[#6A24D4]">Nueva venta</h2>
            <p className="text-sm text-slate-500">Datos generales</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Cliente</label>
              <select
                value={values.cliente}
                onChange={(event) => setValues((prev) => ({ ...prev, cliente: event.target.value }))}
                className="h-10 w-full rounded-lg border border-violet-200 bg-white px-3 text-sm text-slate-900"
              >
                <option value="">Opcional · Sin cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={String(cliente.id)}>
                    {cliente.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Mascota {mascotaRequired ? '*' : ''}
              </label>
              <select
                value={values.mascota}
                onChange={(event) => setValues((prev) => ({ ...prev, mascota: event.target.value }))}
                className="h-10 w-full rounded-lg border border-violet-200 bg-white px-3 text-sm text-slate-900"
              >
                <option value="">{mascotaRequired ? 'Requerida si hay servicios' : 'Opcional'}</option>
                {visibleMascotas.map((mascota) => (
                  <option key={mascota.id} value={String(mascota.id)}>
                    {mascota.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Observación</label>
              <Textarea
                value={values.observacion}
                onChange={(event) => setValues((prev) => ({ ...prev, observacion: event.target.value }))}
                placeholder="Venta presencial"
                className="min-h-10 border-violet-200 bg-white"
              />
            </div>
          </div>

          {mascotaRequired ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
              Los servicios requieren mascota asociada.
            </div>
          ) : null}

          {hasProducts ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              El stock se descontará al registrar la venta.
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Detalles de venta</h3>
              <Button
                type="button"
                className="h-9 bg-[#6A24D4] px-4 text-white hover:bg-[#5b1fbc]"
                onClick={addDetail}
              >
                + Agregar ítem
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-violet-100">
              <table className="min-w-full text-sm text-slate-900">
                <thead className="bg-gradient-to-r from-[#6A24D4] to-[#7C3AED] text-white">
                  <tr>
                    <th className="px-3 py-3 text-left">Tipo</th>
                    <th className="px-3 py-3 text-left">Producto / Servicio</th>
                    <th className="px-3 py-3 text-left">Mascota / Precio</th>
                    <th className="px-3 py-3 text-left">Cantidad</th>
                    <th className="px-3 py-3 text-left">Subtotal estimado</th>
                    <th className="px-3 py-3 text-left">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {values.detalles.map((detail) => {
                    const selectedServiceId = toPositiveInt(detail.servicio)
                    const availablePrices = pricesByService.get(selectedServiceId) ?? []
                    const unitPrice =
                      detail.tipo_item === 'PRODUCTO'
                        ? productos.find((item) => item.id === toPositiveInt(detail.producto))?.unitPrice ?? 0
                        : preciosServicio.find((item) => item.id === toPositiveInt(detail.precio_servicio))
                            ?.unitPrice ?? 0
                    const subtotal = unitPrice * Math.max(1, toPositiveInt(detail.cantidad))

                    return (
                      <tr key={detail.uid} className="border-t border-violet-100">
                        <td className="px-3 py-3">
                          <select
                            value={detail.tipo_item}
                            onChange={(event) => updateDetail(detail.uid, 'tipo_item', event.target.value)}
                            className="h-9 w-full rounded-lg border border-violet-200 bg-white px-2 text-xs"
                          >
                            <option value="PRODUCTO">PRODUCTO</option>
                            <option value="SERVICIO">SERVICIO</option>
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          {detail.tipo_item === 'PRODUCTO' ? (
                            <select
                              value={detail.producto}
                              onChange={(event) => updateDetail(detail.uid, 'producto', event.target.value)}
                              className="h-9 w-full rounded-lg border border-violet-200 bg-white px-2 text-xs"
                            >
                              <option value="">Seleccionar producto</option>
                              {productos.map((producto) => (
                                <option key={producto.id} value={String(producto.id)}>
                                  {producto.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <select
                              value={detail.servicio}
                              onChange={(event) => updateDetail(detail.uid, 'servicio', event.target.value)}
                              className="h-9 w-full rounded-lg border border-violet-200 bg-white px-2 text-xs"
                            >
                              <option value="">Seleccionar servicio</option>
                              {servicios.map((servicio) => (
                                <option key={servicio.id} value={String(servicio.id)}>
                                  {servicio.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {detail.tipo_item === 'PRODUCTO' ? (
                            <span className="text-xs text-slate-500">No requiere mascota</span>
                          ) : (
                            <select
                              value={detail.precio_servicio}
                              onChange={(event) =>
                                updateDetail(detail.uid, 'precio_servicio', event.target.value)
                              }
                              className="h-9 w-full rounded-lg border border-violet-200 bg-white px-2 text-xs"
                            >
                              <option value="">Seleccionar precio</option>
                              {availablePrices.map((precio) => (
                                <option key={precio.id} value={String(precio.id)}>
                                  {precio.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <Input
                            type="number"
                            min={1}
                            value={detail.cantidad}
                            onChange={(event) => updateDetail(detail.uid, 'cantidad', event.target.value)}
                            className="h-9 w-24 border-violet-200 bg-white text-xs"
                          />
                        </td>
                        <td className="px-3 py-3 font-semibold">{formatCurrencyBs(subtotal)}</td>
                        <td className="px-3 py-3">
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 px-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                            onClick={() => removeDetail(detail.uid)}
                          >
                            Quitar
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {errors.length > 0 ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <ul className="space-y-1">
                {errors.map((error) => (
                  <li key={error}>• {error}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <VentaResumenCard
              title="Total estimado"
              amount={estimatedTotal}
              note="El total final será calculado y validado por el backend."
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 bg-emerald-600 px-6 text-base font-semibold text-white hover:bg-emerald-700"
            >
              {isSubmitting ? 'Registrando venta...' : 'Registrar venta'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
