import type { ColumnDef } from '@tanstack/react-table'
import type { ComponenteSistema, GrupoPermiso, GrupoPermisoUpdatePayload } from '../store/rolesPermisos.types'
import { Check, X } from 'lucide-react'

interface PermisosColumnsProps {
  permisosActuales: GrupoPermiso[]
  loadingMap: Record<string, boolean>
  onToggle: (
    componenteId: number,
    accion: keyof GrupoPermisoUpdatePayload,
    valorActual: boolean,
    permisoExistente?: GrupoPermiso
  ) => void
}

export const getPermisosColumns = ({
  permisosActuales,
  loadingMap,
  onToggle,
}: PermisosColumnsProps): ColumnDef<ComponenteSistema>[] => {
  const getPermisoForComponente = (componenteId: number) => {
    return permisosActuales.find((p) => p.componente.id_componente === componenteId)
  }

  const renderCheckbox = (
    componenteId: number,
    accion: keyof GrupoPermisoUpdatePayload,
    permisoExistente?: GrupoPermiso
  ) => {
    const isChecked = permisoExistente ? permisoExistente[accion] : false
    const isLoading = loadingMap[`${componenteId}-${accion}`]

    return (
      <button
        type="button"
        disabled={isLoading}
        onClick={() => onToggle(componenteId, accion, isChecked, permisoExistente)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
          isLoading
            ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-100'
            : isChecked
            ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20'
            : 'border-slate-200 bg-slate-50 text-slate-300 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-500'
        }`}
      >
        {isChecked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </button>
    )
  }

  return [
    {
      accessorKey: 'codigo',
      header: 'Módulo / Componente',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-slate-900">{row.original.codigo}</div>
          <div className="text-xs text-slate-500">{row.original.nombre}</div>
        </div>
      ),
    },
    {
      id: 'puede_ver',
      header: () => <div className="text-center">Ver</div>,
      cell: ({ row }) => {
        const permiso = getPermisoForComponente(row.original.id_componente)
        return <div className="flex justify-center">{renderCheckbox(row.original.id_componente, 'puede_ver', permiso)}</div>
      },
    },
    {
      id: 'puede_crear',
      header: () => <div className="text-center">Crear</div>,
      cell: ({ row }) => {
        const permiso = getPermisoForComponente(row.original.id_componente)
        return <div className="flex justify-center">{renderCheckbox(row.original.id_componente, 'puede_crear', permiso)}</div>
      },
    },
    {
      id: 'puede_editar',
      header: () => <div className="text-center">Editar</div>,
      cell: ({ row }) => {
        const permiso = getPermisoForComponente(row.original.id_componente)
        return <div className="flex justify-center">{renderCheckbox(row.original.id_componente, 'puede_editar', permiso)}</div>
      },
    },
    {
      id: 'puede_eliminar',
      header: () => <div className="text-center">Eliminar</div>,
      cell: ({ row }) => {
        const permiso = getPermisoForComponente(row.original.id_componente)
        return <div className="flex justify-center">{renderCheckbox(row.original.id_componente, 'puede_eliminar', permiso)}</div>
      },
    },
    {
      id: 'puede_exportar',
      header: () => <div className="text-center">Exportar</div>,
      cell: ({ row }) => {
        const permiso = getPermisoForComponente(row.original.id_componente)
        return <div className="flex justify-center">{renderCheckbox(row.original.id_componente, 'puede_exportar', permiso)}</div>
      },
    },
    {
      id: 'puede_ejecutar',
      header: () => <div className="text-center">Ejecutar</div>,
      cell: ({ row }) => {
        const permiso = getPermisoForComponente(row.original.id_componente)
        return <div className="flex justify-center">{renderCheckbox(row.original.id_componente, 'puede_ejecutar', permiso)}</div>
      },
    },
  ]
}
