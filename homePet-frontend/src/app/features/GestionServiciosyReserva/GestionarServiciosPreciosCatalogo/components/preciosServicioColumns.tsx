import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import type { PrecioServicio } from '../store'

interface PreciosColumnsActions {
  onEdit: (precio: PrecioServicio) => void
  onToggleStatus: (precio: PrecioServicio) => void
  canEdit?: boolean
}
export const getPreciosServicioColumns = ({
  onEdit,
  onToggleStatus,
  canEdit = true,
}: PreciosColumnsActions): ColumnDef<PrecioServicio>[] => {
  const columns: ColumnDef<PrecioServicio>[] = [
    {
      accessorKey: 'servicio_nombre',
      header: 'Servicio',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.servicio_nombre || '-'}</span>
      ),
    },
    {
      accessorKey: 'variacion',
      header: 'Variación',
    },
    {
      accessorKey: 'modalidad',
      header: 'Modalidad',
      cell: ({ row }) => row.original.modalidad || 'General',
    },
    {
      accessorKey: 'precio',
      header: 'Precio',
      cell: ({ row }) => `Bs. ${Number(row.original.precio).toFixed(2)}`,
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            row.original.estado
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          {row.original.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ]

  if (canEdit) {
    columns.push({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const precio = row.original
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(precio)}>
              Editar
            </Button>
            <Button
              variant={precio.estado ? 'destructive' : 'default'}
              size="sm"
              onClick={() => onToggleStatus(precio)}
            >
              {precio.estado ? 'Desactivar' : 'Activar'}
            </Button>
          </div>
        )
      },
    })
  }

  return columns
}
