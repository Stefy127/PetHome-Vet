import { useState } from 'react'
import {
  useGetGruposQuery,
  useCreateGrupoMutation,
  useUpdateGrupoMutation,
  useDeleteGrupoMutation,
  useGetComponentesQuery,
  useGetPermisosByGrupoQuery,
  useCreatePermisoMutation,
  useUpdatePermisoMutation,
  useDeletePermisoMutation,
} from '../store'
import type { GrupoUsuario } from '../store/rolesPermisos.types'
import { GruposTable, GrupoDialog, PermisosDialog } from '../components'
import { Shield, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Gestionar_Roles_Permisos() {
  const [isGrupoDialogOpen, setIsGrupoDialogOpen] = useState(false)
  const [isPermisosDialogOpen, setIsPermisosDialogOpen] = useState(false)
  const [selectedGrupo, setSelectedGrupo] = useState<GrupoUsuario | null>(null)

  const { data: grupos = [], isLoading: isLoadingGrupos } = useGetGruposQuery()
  const { data: componentes = [] } = useGetComponentesQuery()

  const {
    data: permisosGrupo = [],
  } = useGetPermisosByGrupoQuery(selectedGrupo?.id_grupo ?? 0, {
    skip: !selectedGrupo || !isPermisosDialogOpen,
  })

  const [createGrupo, { isLoading: isCreatingGrupo }] = useCreateGrupoMutation()
  const [updateGrupo, { isLoading: isUpdatingGrupo }] = useUpdateGrupoMutation()
  const [deleteGrupo] = useDeleteGrupoMutation()

  const [createPermiso] = useCreatePermisoMutation()
  const [updatePermiso] = useUpdatePermisoMutation()
  const [deletePermiso] = useDeletePermisoMutation()

  const handleCreateGrupo = () => {
    setSelectedGrupo(null)
    setIsGrupoDialogOpen(true)
  }

  const handleEditGrupo = (grupo: GrupoUsuario) => {
    setSelectedGrupo(grupo)
    setIsGrupoDialogOpen(true)
  }

  const handleDeleteGrupo = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este rol/grupo? Esta acción podría afectar a los usuarios asignados.')) {
      try {
        await deleteGrupo(id).unwrap()
      } catch (error) {
        console.error('Error al eliminar grupo:', error)
        alert('No se pudo eliminar el grupo.')
      }
    }
  }

  const handleManagePermissions = (grupo: GrupoUsuario) => {
    setSelectedGrupo(grupo)
    setIsPermisosDialogOpen(true)
  }

  const handleGrupoSubmit = async (payload: any) => {
    try {
      if (selectedGrupo) {
        await updateGrupo({ id: selectedGrupo.id_grupo, payload }).unwrap()
      } else {
        await createGrupo(payload).unwrap()
      }
      setIsGrupoDialogOpen(false)
    } catch (error) {
      console.error('Error al guardar grupo:', error)
      alert('Error al guardar la información del rol.')
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F97316] md:text-4xl">
            Administrar Roles y Permisos
          </h1>
          <p className="mt-2 text-slate-600">
            Crea grupos de usuarios y configura los niveles de acceso (RBAC) a los diferentes módulos.
          </p>
        </div>
        <Button
          onClick={handleCreateGrupo}
          className="flex h-12 items-center gap-2 rounded-2xl bg-[#7C3AED] px-6 text-white hover:bg-[#6D28D9]"
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">Nuevo Rol</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-[#F97316]/30 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#F97316]/10 p-3">
              <Shield className="h-6 w-6 text-[#F97316]" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Roles Totales</p>
              <p className="text-2xl font-bold text-slate-900">{grupos.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-[#7C3AED]/30 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#7C3AED]/10 p-3">
              <Shield className="h-6 w-6 text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Módulos Registrados</p>
              <p className="text-2xl font-bold text-slate-900">{componentes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {isLoadingGrupos ? (
        <div className="flex h-40 items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <p className="text-slate-500">Cargando roles...</p>
        </div>
      ) : (
        <GruposTable
          grupos={grupos}
          onEdit={handleEditGrupo}
          onDelete={handleDeleteGrupo}
          onManagePermissions={handleManagePermissions}
        />
      )}

      <GrupoDialog
        open={isGrupoDialogOpen}
        onOpenChange={setIsGrupoDialogOpen}
        grupoInicial={selectedGrupo}
        onSubmit={handleGrupoSubmit}
        loading={isCreatingGrupo || isUpdatingGrupo}
      />

      <PermisosDialog
        open={isPermisosDialogOpen}
        onOpenChange={setIsPermisosDialogOpen}
        grupo={selectedGrupo}
        componentes={componentes}
        permisosActuales={permisosGrupo}
        onCreatePermiso={async (payload) => { await createPermiso(payload).unwrap() }}
        onUpdatePermiso={async (id, payload) => { await updatePermiso({ id, grupo_id: selectedGrupo!.id_grupo, payload }).unwrap() }}
        onDeletePermiso={async (id) => { await deletePermiso({ id, grupo_id: selectedGrupo!.id_grupo }).unwrap() }}
      />
    </div>
  )
}
