import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import type { CategoriaServicio } from '../store'

interface CategoriasColumnsActions {
  onEdit: (categoria: CategoriaServicio) => void
  onToggleStatus: (categoria: CategoriaServicio) => void
  canEdit?: boolean
}
export const getCategoriasServicioColumns = ({
  onEdit,
  onToggleStatus,
  canEdit = true,
}: CategoriasColumnsActions): ColumnDef<CategoriaServicio>[] => {
  const columns: ColumnDef<CategoriaServicio>[] = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nombre}</span>
      ),
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: ({ row }) => row.original.descripcion || 'Sin descripción',
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
        const categoria = row.original

        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(categoria)}>
              Editar
            </Button>
            <Button
              variant={categoria.estado ? 'destructive' : 'default'}
              size="sm"
              onClick={() => onToggleStatus(categoria)}
            >
              {categoria.estado ? 'Desactivar' : 'Activar'}
            </Button>
          </div>
        )
      },
    })
  }

  return columns
}
