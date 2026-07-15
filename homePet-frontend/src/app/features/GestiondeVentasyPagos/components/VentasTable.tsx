import { Button } from '#/components/ui/button'
import type { Venta } from '../types/ventas.types'
import {
  formatCurrencyBs,
  formatDateTime,
  getVentaClienteNombre,
  getVentaEstado,
  getVentaFecha,
  getVentaId,
  getVentaMascotaNombre,
  getVentaSubtotal,
  getVentaTotal,
} from '../utils/ventasFormatters'
import { VentaEstadoBadge } from './VentaEstadoBadge'

type VentasTableProps = {
  ventas: Venta[]
  isLoading?: boolean
  onViewDetail: (id: number) => void
}

export function VentasTable({ ventas, isLoading = false, onViewDetail }: VentasTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-violet-100 bg-white p-5 text-sm text-slate-600">
        Cargando ventas...
      </div>
    )
  }

  if (!ventas.length) {
    return (
      <div className="rounded-xl border border-violet-100 bg-white p-5 text-sm text-slate-600">
        No se encontraron ventas con los filtros aplicados.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-violet-100 bg-white">
      <table className="min-w-full text-sm text-slate-900">
        <thead className="bg-gradient-to-r from-[#6A24D4] to-[#7C3AED] text-white">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Fecha</th>
            <th className="px-4 py-3 text-left">Estado</th>
            <th className="px-4 py-3 text-left">Cliente</th>
            <th className="px-4 py-3 text-left">Mascota</th>
            <th className="px-4 py-3 text-left">Subtotal</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => {
            const id = getVentaId(venta)
            return (
              <tr key={id} className="border-t border-violet-100">
                <td className="px-4 py-3 font-bold">#{id}</td>
                <td className="px-4 py-3">{formatDateTime(getVentaFecha(venta))}</td>
                <td className="px-4 py-3">
                  <VentaEstadoBadge estado={getVentaEstado(venta)} />
                </td>
                <td className="px-4 py-3 font-semibold">{getVentaClienteNombre(venta)}</td>
                <td className="px-4 py-3">{getVentaMascotaNombre(venta)}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrencyBs(getVentaSubtotal(venta))}</td>
                <td className="px-4 py-3 font-bold">{formatCurrencyBs(getVentaTotal(venta))}</td>
                <td className="px-4 py-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 border-violet-200 bg-white text-xs font-semibold text-slate-800"
                    onClick={() => onViewDetail(id)}
                  >
                    Ver detalle
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
