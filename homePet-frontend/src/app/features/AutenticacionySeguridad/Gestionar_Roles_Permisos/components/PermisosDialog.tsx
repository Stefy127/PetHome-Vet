import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type {
  GrupoUsuario,
  ComponenteSistema,
  GrupoPermiso,
  GrupoPermisoCreatePayload,
  GrupoPermisoUpdatePayload,
} from '../store/rolesPermisos.types'
import { getPermisosColumns } from './permisosColumns'

interface PermisosDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  grupo: GrupoUsuario | null
  componentes: ComponenteSistema[]
  permisosActuales: GrupoPermiso[]
  onCreatePermiso: (payload: GrupoPermisoCreatePayload) => Promise<void>
  onUpdatePermiso: (id: number, payload: GrupoPermisoUpdatePayload) => Promise<void>
  onDeletePermiso: (id: number) => Promise<void>
}

export function PermisosDialog({
  open,
  onOpenChange,
  grupo,
  componentes,
  permisosActuales,
  onCreatePermiso,
  onUpdatePermiso,
  onDeletePermiso,
}: PermisosDialogProps) {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  const handleToggleAction = async (
    componenteId: number,
    accion: keyof GrupoPermisoUpdatePayload,
    valorActual: boolean,
    permisoExistente?: GrupoPermiso
  ) => {
    const key = `${componenteId}-${accion}`
    setLoadingMap((prev) => ({ ...prev, [key]: true }))

    try {
      if (permisoExistente) {
        const payload: GrupoPermisoUpdatePayload = {
          puede_ver: permisoExistente.puede_ver,
          puede_crear: permisoExistente.puede_crear,
          puede_editar: permisoExistente.puede_editar,
          puede_eliminar: permisoExistente.puede_eliminar,
          puede_exportar: permisoExistente.puede_exportar,
          puede_ejecutar: permisoExistente.puede_ejecutar,
        }
        
        payload[accion] = !valorActual

        const hasAnyPermission = Object.values(payload).some((val) => val === true)
        
        if (!hasAnyPermission) {
          await onDeletePermiso(permisoExistente.id_permiso_componente)
        } else {
          await onUpdatePermiso(permisoExistente.id_permiso_componente, payload)
        }
      } else {
        const payload: GrupoPermisoCreatePayload = {
          grupo: grupo!.id_grupo,
          componente_id: componenteId,
          puede_ver: accion === 'puede_ver',
          puede_crear: accion === 'puede_crear',
          puede_editar: accion === 'puede_editar',
          puede_eliminar: accion === 'puede_eliminar',
          puede_exportar: accion === 'puede_exportar',
          puede_ejecutar: accion === 'puede_ejecutar',
        }
        await onCreatePermiso(payload)
      }
    } finally {
      setLoadingMap((prev) => ({ ...prev, [key]: false }))
    }
  }

  const columns = getPermisosColumns({ 
    permisosActuales, 
    loadingMap, 
    onToggle: handleToggleAction 
  })

  const table = useReactTable({
    data: componentes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  } as any)

  if (!grupo) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#F97316]/10 p-3">
              <ShieldAlert className="h-6 w-6 text-[#F97316]" />
            </div>
            <div>
              <DialogTitle className="text-2xl text-[#7C3AED]">
                Permisos: {grupo.nombre}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1">
                Configura los accesos granulares para este rol.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-6 py-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 font-semibold text-slate-900 border-b">
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
              <tbody className="divide-y divide-slate-100">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 pt-2 flex justify-end">
          <Button
            type="button"
            className="bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
            onClick={() => onOpenChange(false)}
          >
            Cerrar panel de permisos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
