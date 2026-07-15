//import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { getBitacoraColumns } from './bitacoraColumns';
import { Activity } from 'lucide-react';
import type { Bitacora } from '../store/bitacora.types';
import { BitacoraDetailsModal } from './BitacoraDetailsModal';
import { useMemo, useState } from 'react';

interface BitacoraTableProps {
  data: Bitacora[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function BitacoraTable({
  data,
  isLoading,
  page,
  totalPages,
  onPageChange,
  hasNext,
  hasPrevious,
}: BitacoraTableProps) {

  const [selectedBitacora, setSelectedBitacora] = useState<Bitacora | null>(null);
  const columns = useMemo(
    () => getBitacoraColumns((bitacora) => setSelectedBitacora(bitacora)), 
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Delegamos la paginación a la API (manual pagination)
    manualPagination: true,
  }as any);

  if (!isLoading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#F97316]/30 bg-white py-16">
        <div className="mb-4 rounded-full bg-[#7C3AED]/10 p-4">
          <Activity className="h-8 w-8 text-[#7C3AED]" />
        </div>
        <h3 className="text-lg font-medium text-black">No hay registros</h3>
        <p className="mt-1 text-gray-600">No se encontraron eventos con los filtros actuales.</p>
      </div>
    );
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
                      className="px-4 py-4 text-sm font-semibold text-white"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className={isLoading ? 'opacity-50' : ''}>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-[#F97316]/20 bg-white hover:bg-slate-50/50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 align-middle text-black text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Controles de Paginación del Servidor */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-600">
          Página {page} de {totalPages || 1}
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevious || isLoading}
            variant="outline"
            className="rounded-lg border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
          >
            Anterior
          </Button>
          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext || isLoading}
            variant="outline"
            className="rounded-lg border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
          >
            Siguiente
          </Button>
        </div>
      </div>

      <BitacoraDetailsModal 
        bitacora={selectedBitacora} 
        onClose={() => setSelectedBitacora(null)} 
      />
    </div>
  );
}