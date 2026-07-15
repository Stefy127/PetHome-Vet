import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import type { Servicio } from '../store'

interface ServiciosColumnsActions {
  onEdit: (servicio: Servicio) => void
  onToggleStatus: (servicio: Servicio) => void
  canEdit?: boolean
}
export const getServiciosColumns = ({
  onEdit,
  onToggleStatus,
  canEdit = true,
}: ServiciosColumnsActions): ColumnDef<Servicio>[] => {
  const columns: ColumnDef<Servicio>[] = [
    {
      accessorKey: 'nombre',
      header: 'Servicio',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nombre}</span>
      ),
    },
    {
      accessorKey: 'categoria_nombre',
      header: 'Categoría',
      cell: ({ row }) => row.original.categoria_nombre || 'Sin categoría',
    },
    {
      accessorKey: 'duracion_estimada',
      header: 'Duración',
      cell: ({ row }) =>
        row.original.duracion_estimada
          ? `${row.original.duracion_estimada} min`
          : 'No definida',
    },
    {
      accessorKey: 'disponible_domicilio',
      header: 'Domicilio',
      cell: ({ row }) => (row.original.disponible_domicilio ? 'Sí' : 'No'),
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
        const servicio = row.original
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(servicio)}>
              Editar
            </Button>
            <Button
              variant={servicio.estado ? 'destructive' : 'default'}
              size="sm"
              onClick={() => onToggleStatus(servicio)}
            >
              {servicio.estado ? 'Desactivar' : 'Activar'}
            </Button>
          </div>
        )
      },
    })
  }

  return columns
}
