import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Shield } from 'lucide-react'
import type { GrupoUsuario } from '../store/rolesPermisos.types'
import { getRolesPermisosColumns } from './rolesPermisosColumns'

interface GruposTableProps {
  grupos: GrupoUsuario[]
  onEdit: (grupo: GrupoUsuario) => void
  onDelete: (id: number) => void
  onManagePermissions: (grupo: GrupoUsuario) => void
}

export function GruposTable({
  grupos,
  onEdit,
  onDelete,
  onManagePermissions,
}: GruposTableProps) {
  const columns = getRolesPermisosColumns({ onEdit, onDelete, onManagePermissions })

  const table = useReactTable({
    data: grupos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  } as any)

  if (!grupos.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#F97316]/50 bg-white py-16 text-center shadow-sm">
        <Shield className="mb-4 h-12 w-12 text-[#F97316]/50" />
        <h3 className="text-lg font-semibold text-slate-800">No hay grupos registrados</h3>
        <p className="text-sm text-slate-500">Crea un nuevo grupo o rol para comenzar a gestionar los permisos.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#F97316]/20 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#7C3AED] text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[#F97316]/10">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-slate-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
