import { useMemo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { PawPrint, Clock } from 'lucide-react'

export type AppointmentStatus = 'Confirmada' | 'En espera' | 'Pendiente'

export interface Appointment {
  id: string
  petName: string
  petType: string
  ownerName: string
  service: string
  time: string
  status: AppointmentStatus
}

const columnHelper = createColumnHelper<Appointment>()

export function AppointmentsTable({
  data = [],
  isLoading = false,
  hasError = false,
}: {
  data?: Appointment[]
  isLoading?: boolean
  hasError?: boolean
}) {
  const columns = useMemo(
    () => [
      columnHelper.accessor('petName', {
        header: 'Mascota',
        cell: (info) => (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <PawPrint className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-[15px]">
                {info.getValue()} <span className="text-gray-400 font-normal">({info.row.original.petType})</span>
              </span>
              <span className="text-sm text-gray-500 mt-0.5">
                {info.row.original.ownerName} - {info.row.original.service}
              </span>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('time', {
        header: 'Hora',
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-gray-500 text-sm justify-end whitespace-nowrap">
            <Clock className="w-4 h-4" />
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => {
          const status = info.getValue()
          let bg = 'bg-green-100 text-green-700'

          if (status === 'En espera') bg = 'bg-yellow-100 text-yellow-700'
          if (status === 'Pendiente') bg = 'bg-gray-100 text-gray-600'

          return (
            <div className="flex justify-end">
              <span className={`px-3 py-1 rounded-md text-xs font-semibold ${bg}`}>
                {status}
              </span>
            </div>
          )
        },
      }),
    ],
    [],
  )

  const table = useReactTable({
    data,
    columns,
    // @ts-expect-error tanstack table requires filterFns in some versions
    filterFns: undefined,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 font-sans">Citas de Hoy</h3>
        <div className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-md">
          {data.length} citas
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl border border-gray-100 bg-gray-50 animate-pulse" />
          ))}
        </div>
      ) : hasError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          No se pudo cargar citas de hoy
        </div>
      ) : table.getRowModel().rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
          Aun no tienes citas registradas
        </div>
      ) : (
        <div className="space-y-3">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors"
            >
              <div className="flex-1">
                {flexRender(
                  row.getVisibleCells()[0].column.columnDef.cell,
                  row.getVisibleCells()[0].getContext(),
                )}
              </div>
              <div className="flex items-center gap-6 justify-end">
                <div className="w-24">
                  {flexRender(
                    row.getVisibleCells()[1].column.columnDef.cell,
                    row.getVisibleCells()[1].getContext(),
                  )}
                </div>
                <div className="w-24">
                  {flexRender(
                    row.getVisibleCells()[2].column.columnDef.cell,
                    row.getVisibleCells()[2].getContext(),
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
