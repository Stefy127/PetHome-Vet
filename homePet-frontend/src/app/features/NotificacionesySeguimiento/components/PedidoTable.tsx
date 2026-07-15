import { Eye, Package } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import type { PedidoListItem } from '../types/notificaciones.types'
import { formatDate, formatMoney } from '../utils/formatters'
import { getStatusMeta } from '../utils/statusMaps'

type PedidoTableProps = {
  rows: PedidoListItem[]
  selectedId?: number | null
  onSelect: (id: number) => void
}

export function PedidoTable({ rows, selectedId, onSelect }: PedidoTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[120px] px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">
              Código
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">Cliente</TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">Entrega</TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">Estado</TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">Total</TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => {
            const isSelected = selectedId === item.id_pedido
            const meta = getStatusMeta(item.estado_pedido)
            return (
              <TableRow
                key={item.id_pedido}
                data-state={isSelected ? 'selected' : undefined}
                className={isSelected ? 'bg-violet-50/40' : undefined}
              >
                <TableCell className="px-4 py-3 text-sm font-semibold text-gray-800">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-indigo-500" />
                    PD-{item.id_pedido}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">{item.usuario_nombre ?? '-'}</p>
                  <p className="text-xs text-gray-500">{item.usuario_correo ?? '-'}</p>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-700">
                  <p>{item.tipo_entrega}</p>
                  <p className="text-xs text-gray-500">{formatDate(item.fecha_pedido)}</p>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Badge variant="outline" className={meta.badgeClass}>
                    {meta.label}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm font-medium text-gray-800">{formatMoney(item.total)}</TableCell>
                <TableCell className="px-4 py-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-violet-200 text-violet-700 hover:bg-violet-50"
                    onClick={() => onSelect(item.id_pedido)}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Ver detalle
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

