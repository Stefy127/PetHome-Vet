import type { DetalleVenta } from '../types/ventas.types'
import {
  formatCurrencyBs,
  getDetalleCantidad,
  getDetalleDescripcion,
  getDetallePrecioUnitario,
  getDetalleSubtotal,
  getDetalleTipo,
} from '../utils/ventasFormatters'

type DetallesVentaTableProps = {
  detalles: DetalleVenta[]
}

export function DetallesVentaTable({ detalles }: DetallesVentaTableProps) {
  if (!detalles.length) {
    return (
      <div className="rounded-xl border border-violet-100 bg-white p-4 text-sm text-slate-500">
        No existen detalles para esta venta.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-violet-100 bg-white">
      <table className="min-w-full text-sm text-slate-900">
        <thead className="bg-gradient-to-r from-[#6A24D4] to-[#7C3AED] text-white">
          <tr>
            <th className="px-4 py-3 text-left">Tipo</th>
            <th className="px-4 py-3 text-left">Descripción</th>
            <th className="px-4 py-3 text-left">Cantidad</th>
            <th className="px-4 py-3 text-left">Precio unitario</th>
            <th className="px-4 py-3 text-left">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((detalle, index) => (
            <tr key={`${getDetalleTipo(detalle)}-${index}`} className="border-t border-violet-100">
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">
                  {getDetalleTipo(detalle)}
                </span>
              </td>
              <td className="px-4 py-3 font-medium">{getDetalleDescripcion(detalle)}</td>
              <td className="px-4 py-3">{getDetalleCantidad(detalle)}</td>
              <td className="px-4 py-3">{formatCurrencyBs(getDetallePrecioUnitario(detalle))}</td>
              <td className="px-4 py-3 font-semibold">{formatCurrencyBs(getDetalleSubtotal(detalle))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
