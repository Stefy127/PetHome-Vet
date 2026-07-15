import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import type { PedidoDetail } from '../types/notificaciones.types'
import { formatDateTime, formatMoney } from '../utils/formatters'
import { getStatusMeta } from '../utils/statusMaps'

type PedidoDetailPanelProps = {
  detail?: PedidoDetail | null
  isLoading?: boolean
}

export function PedidoDetailPanel({ detail, isLoading }: PedidoDetailPanelProps) {
  if (isLoading) {
    return (
      <Card className="h-full border-orange-100">
        <CardContent className="p-5">
          <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-48 animate-pulse rounded bg-slate-100" />
        </CardContent>
      </Card>
    )
  }

  if (!detail) {
    return (
      <Card className="h-full border-orange-100">
        <CardContent className="flex h-full min-h-[300px] items-center justify-center p-6 text-center text-sm text-gray-500">
          Selecciona un pedido para ver su detalle.
        </CardContent>
      </Card>
    )
  }

  const statusMeta = getStatusMeta(detail.estado_pedido)

  return (
    <Card className="h-full border-orange-100">
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-2xl font-bold text-orange-600">Detalle del pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-2">
        <div className="rounded-xl border border-violet-100 bg-violet-50/30 p-3">
          <p className="text-sm font-semibold text-gray-900">Pedido PD-{detail.id_pedido}</p>
          <p className="text-xs text-gray-600">{detail.usuario_nombre}</p>
          <p className="text-xs text-gray-500">{detail.usuario_correo}</p>
        </div>

        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Estado</p>
            <Badge variant="outline" className={statusMeta.badgeClass}>
              {statusMeta.label}
            </Badge>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Tipo entrega</p>
            <p className="font-medium text-gray-900">{detail.tipo_entrega}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Fecha pedido</p>
            <p className="font-medium text-gray-900">{formatDateTime(detail.fecha_pedido)}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Dirección</p>
            <p className="font-medium text-gray-900">{detail.direccion_entrega || '-'}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Subtotal</p>
            <p className="font-medium text-gray-900">{formatMoney(detail.subtotal)}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Costo envío</p>
            <p className="font-medium text-gray-900">{formatMoney(detail.costo_envio)}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Total</p>
            <p className="text-lg font-bold text-gray-900">{formatMoney(detail.total)}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Observación</p>
            <p className="font-medium text-gray-900">{detail.observacion || '-'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900">Ítems del pedido</p>
          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-3 py-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                    Producto
                  </TableHead>
                  <TableHead className="px-3 py-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                    Cantidad
                  </TableHead>
                  <TableHead className="px-3 py-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                    Precio
                  </TableHead>
                  <TableHead className="px-3 py-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                    Subtotal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail.detalles.map((item) => (
                  <TableRow key={item.id_detalle_pedido}>
                    <TableCell className="px-3 py-2 text-sm text-gray-800">{item.producto_nombre}</TableCell>
                    <TableCell className="px-3 py-2 text-sm text-gray-700">{item.cantidad}</TableCell>
                    <TableCell className="px-3 py-2 text-sm text-gray-700">{formatMoney(item.precio_unitario)}</TableCell>
                    <TableCell className="px-3 py-2 text-sm font-medium text-gray-900">{formatMoney(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900">Seguimientos relacionados</p>
          <div className="space-y-2">
            {detail.seguimientos.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-gray-500">
                No hay seguimientos relacionados.
              </p>
            )}
            {detail.seguimientos.map((item) => {
              const meta = getStatusMeta(item.estado_actual)
              return (
                <div key={item.id_seguimiento} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Seguimiento #{item.id_seguimiento}</p>
                      <p className="text-xs text-gray-500">{item.descripcion || 'Sin descripción'}</p>
                    </div>
                    <Badge variant="outline" className={meta.badgeClass}>
                      {meta.label}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs font-medium text-gray-500">{formatDateTime(item.fecha_hora)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

