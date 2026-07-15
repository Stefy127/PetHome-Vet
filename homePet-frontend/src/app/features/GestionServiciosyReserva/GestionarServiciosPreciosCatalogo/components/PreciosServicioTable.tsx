import { useMemo, useState } from 'react'
import { PawPrint } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { PrecioServicio } from '../store'
import { getPreciosServicioColumns } from './preciosServicioColumns'

interface PreciosServicioTableProps {
  data: PrecioServicio[]
  onEdit: (precio: PrecioServicio) => void
  onToggleStatus: (precio: PrecioServicio) => void
  canEdit?: boolean
}

export function PreciosServicioTable({
  data,
  onEdit,
  onToggleStatus,
  canEdit = true,
}: PreciosServicioTableProps) {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return data

    return data.filter((precio) => {
      return (
        (precio.servicio_nombre ?? '').toLowerCase().includes(term) ||
        precio.variacion.toLowerCase().includes(term) ||
        (precio.modalidad ?? '').toLowerCase().includes(term) ||
        String(precio.precio).toLowerCase().includes(term) ||
        (precio.descripcion ?? '').toLowerCase().includes(term) ||
        (precio.estado ? 'activo' : 'inactivo').includes(term)
      )
    })
  }, [data, search])

  const columns = getPreciosServicioColumns({
    onEdit,
    onToggleStatus,
    canEdit,
  })

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  } as any)

  if (filteredData.length === 0) {
    return (
      <div className="space-y-4">
        <Input
          placeholder="Buscar precio por servicio, variación o modalidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#F97316]/30 bg-white py-16">
          <div className="mb-4 rounded-full bg-[#7C3AED]/10 p-4">
            <PawPrint className="h-8 w-8 text-[#7C3AED]" />
          </div>
          <h3 className="text-lg font-medium text-black">No hay precios</h3>
          <p className="mt-1 text-gray-600">
            No se encontraron precios con los filtros aplicados
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar precio por servicio, variación o modalidad..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-hidden rounded-2xl border border-[#F97316] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-[#7C3AED] text-left">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-4 py-4 text-sm font-semibold text-white ${
                        header.id === 'acciones' ? 'text-right' : ''
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#F97316]/20 bg-white hover:bg-slate-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-4 align-middle text-black"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-black/70">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount() || 1}
        </div>

        <div className="space-x-2">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Anterior
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
