import type { ColumnDef } from '@tanstack/react-table'
import type { GrupoUsuario } from '../store/rolesPermisos.types'
import { Shield, Pencil, Trash2, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RolesPermisosColumnsProps {
  onEdit: (grupo: GrupoUsuario) => void
  onDelete: (id: number) => void
  onManagePermissions: (grupo: GrupoUsuario) => void
}

export const getRolesPermisosColumns = ({
  onEdit,
  onDelete,
  onManagePermissions,
}: RolesPermisosColumnsProps): ColumnDef<GrupoUsuario>[] => [
  {
    accessorKey: 'nombre',
    header: 'Rol / Grupo',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-[#F97316]" />
        <span className="font-medium text-slate-900">{row.original.nombre}</span>
      </div>
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
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.original.estado
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {row.original.estado ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
  {
    id: 'acciones',
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onManagePermissions(row.original)}
          className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white"
          title="Administrar permisos"
        >
          <Key className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(row.original)}
          className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
          title="Editar rol"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(row.original.id_grupo)}
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          title="Eliminar rol"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]
