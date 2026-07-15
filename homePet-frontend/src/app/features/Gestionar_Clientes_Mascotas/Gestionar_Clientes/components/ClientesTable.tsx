import { Button } from '@/components/ui/button'
import type { Cliente } from '../store/gestionarClientes.types'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { getClientesColumns } from './clientesColumns'
import { PawPrint } from 'lucide-react'

interface ClientesTableProps {
  clientes: Cliente[]
  onEdit: (cliente: Cliente) => void
  onDelete: (clienteId: number) => void
  onToggleStatus: (clienteId: number) => void
  pageCount: number
  pageIndex: number
  pageSize: number
  onPaginationChange: (pagination: any) => void
  canEdit?: boolean
}

export function ClientesTable({
  clientes,
  onEdit,
  onDelete,
  onToggleStatus,
  pageCount,
  pageIndex,
  pageSize,
  onPaginationChange,
  canEdit = true,
}: ClientesTableProps) {
  const columns = getClientesColumns({ onEdit, onDelete, onToggleStatus, canEdit })

  const table = useReactTable({
    data: clientes,
    columns,
    pageCount,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange,
    state: {
      pagination: { pageIndex, pageSize },
    },
  } as any) // suppress filterFns issue

  if (clientes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#F97316]/30 bg-white py-16">
        <div className="mb-4 rounded-full bg-[#7C3AED]/10 p-4">
          <PawPrint className="h-8 w-8 text-[#7C3AED]" />
        </div>
        <h3 className="text-lg font-medium text-black">No hay clientes</h3>
        <p className="mt-1 text-gray-600">
          No se encontraron clientes con los filtros aplicados
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[#F97316] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-[#7C3AED] text-left">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-4 py-4 text-sm font-semibold text-white ${header.id === 'acciones' ? 'text-right' : ''}`}
                    >
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
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-[#F97316]/20 bg-white hover:bg-slate-50/50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 align-middle text-black">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Paginación de TanStack */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-black-50">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount() || 1}
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-black-300 px-4 py-2 text-sm font-medium hover:bg-green-500 disabled:opacity-50"
          >
            Anterior
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border border-black-300 px-4 py-2 text-sm font-medium hover:bg-green-500 disabled:opacity-50"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}