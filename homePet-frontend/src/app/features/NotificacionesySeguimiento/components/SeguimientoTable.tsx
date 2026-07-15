import { Eye, Stethoscope, CalendarCheck, Package } from 'lucide-react'
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
import type { SeguimientoListItem } from '../types/notificaciones.types'
import { buildTrackingCode, formatDate } from '../utils/formatters'
import { getStatusMeta } from '../utils/statusMaps'

type SeguimientoTableProps = {
  rows: SeguimientoListItem[]
  selectedId?: number | null
  onSelect: (id: number) => void
}

function TypeIcon({ tipo }: { tipo: string }) {
  if (tipo === 'CITA') return <CalendarCheck className="h-4 w-4 text-violet-500" />
  if (tipo === 'SERVICIO') return <Stethoscope className="h-4 w-4 text-orange-500" />
  if (tipo === 'PEDIDO') return <Package className="h-4 w-4 text-indigo-500" />
  return null
}

export function SeguimientoTable({ rows, selectedId, onSelect }: SeguimientoTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[140px] px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">
              Código
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">Tipo</TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">
              Cliente / Mascota
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">Estado</TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">Fecha</TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold tracking-wide text-slate-500 uppercase">Acción</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((item) => {
            const meta = getStatusMeta(item.estado_actual)
            const clientName = item.usuario?.nombre ?? '-'
            const petName = item.pedido ? `Pedido #${item.pedido.id_pedido}` : item.cita ? `Cita #${item.cita.id_cita}` : '-'
            const isSelected = selectedId === item.id_seguimiento
            return (
              <TableRow
                key={item.id_seguimiento}
                data-state={isSelected ? 'selected' : undefined}
                className={isSelected ? 'bg-violet-50/40' : undefined}
              >
                <TableCell className="px-4 py-3 text-sm font-semibold text-gray-800">
                  <div className="flex items-center gap-2">
                    <TypeIcon tipo={item.tipo_seguimiento} />
                    <span>{buildTrackingCode(item)}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm font-medium text-gray-700">
                  {item.tipo_seguimiento}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">{clientName}</p>
                  <p className="text-xs text-gray-500">{petName}</p>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Badge variant="outline" className={meta.badgeClass}>
                    {meta.label}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-700">{formatDate(item.fecha_hora)}</TableCell>
                <TableCell className="px-4 py-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-violet-200 text-violet-700 hover:bg-violet-50"
                    onClick={() => onSelect(item.id_seguimiento)}
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

