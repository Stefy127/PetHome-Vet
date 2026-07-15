import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import type { SelectOption } from '../types/ventas.types'

export type VentasFiltersValue = {
  estado_venta: string
  fecha_desde: string
  fecha_hasta: string
  cliente: string
  mascota: string
}

type VentasFiltersProps = {
  values: VentasFiltersValue
  clientes: SelectOption[]
  mascotas: SelectOption[]
  onChange: (next: VentasFiltersValue) => void
  onApply: () => void
  onGoToNewVenta: () => void
  isLoading?: boolean
}

export function VentasFilters({
  values,
  clientes,
  mascotas,
  onChange,
  onApply,
  onGoToNewVenta,
  isLoading = false,
}: VentasFiltersProps) {
  return (
    <Card className="border-violet-100">
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Estado</label>
            <select
              value={values.estado_venta}
              onChange={(event) => onChange({ ...values, estado_venta: event.target.value })}
              className="h-10 w-full rounded-lg border border-violet-200 bg-white px-3 text-sm text-slate-900"
            >
              <option value="">Todos</option>
              <option value="PENDIENTE_COBRO">PENDIENTE_COBRO</option>
              <option value="ANULADA">ANULADA</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Fecha desde</label>
            <Input
              type="date"
              value={values.fecha_desde}
              onChange={(event) => onChange({ ...values, fecha_desde: event.target.value })}
              className="border-violet-200 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Fecha hasta</label>
            <Input
              type="date"
              value={values.fecha_hasta}
              onChange={(event) => onChange({ ...values, fecha_hasta: event.target.value })}
              className="border-violet-200 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Cliente</label>
            <select
              value={values.cliente}
              onChange={(event) => onChange({ ...values, cliente: event.target.value })}
              className="h-10 w-full rounded-lg border border-violet-200 bg-white px-3 text-sm text-slate-900"
            >
              <option value="">Todos</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={String(cliente.id)}>
                  {cliente.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Mascota</label>
            <select
              value={values.mascota}
              onChange={(event) => onChange({ ...values, mascota: event.target.value })}
              className="h-10 w-full rounded-lg border border-violet-200 bg-white px-3 text-sm text-slate-900"
            >
              <option value="">Todas</option>
              {mascotas.map((mascota) => (
                <option key={mascota.id} value={String(mascota.id)}>
                  {mascota.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            type="button"
            onClick={onApply}
            disabled={isLoading}
            className="h-10 bg-[#6A24D4] px-6 font-semibold text-white hover:bg-[#5b1fbc]"
          >
            Filtrar
          </Button>
          <Button
            type="button"
            onClick={onGoToNewVenta}
            className="h-10 bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
          >
            + Nueva venta
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
