import { useMemo } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Edit2, Trash2, PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '#/components/ui/badge'
import type { Raza } from '../store'

interface RazasTableProps {
  data: Raza[]
  onEdit: (raza: Raza) => void
  onDelete: (raza: Raza) => void
  canEdit: boolean
}

export function RazasTable({ data, onEdit, onDelete, canEdit }: RazasTableProps) {
  const columns = useMemo<ColumnDef<Raza>[]>(
    () => [
      {
        accessorKey: 'id_raza',
        header: 'ID',
        cell: (info) => <span className="font-mono text-xs">#{info.getValue() as number}</span>,
      },
      {
        accessorKey: 'nombre',
        header: 'Raza',
        cell: (info) => <span className="font-semibold text-slate-900">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'especie_nombre',
        header: 'Especie',
        cell: (info) => (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1">
            <PawPrint className="h-3 w-3" />
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: (info) => (
          <div className="flex items-center gap-2">
            {canEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(info.row.original)}
                className="h-8 w-8 text-blue-600 hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {canEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(info.row.original)}
                className="h-8 w-8 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [canEdit, onEdit, onDelete]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: () => true,
    },
  })

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 font-semibold text-slate-900">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
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
  )
}
