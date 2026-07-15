export interface ComponenteSistema {
  id_componente: number
  codigo: string
  nombre: string
  tipo: string
  plataforma: string
}

export interface GrupoUsuario {
  id_grupo: number
  nombre: string
  descripcion: string | null
  estado: boolean
}

export interface GrupoCreatePayload {
  nombre: string
  descripcion: string | null
  estado: boolean
}

export interface GrupoPermiso {
  id_permiso_componente: number
  grupo: number
  componente: ComponenteSistema
  puede_ver: boolean
  puede_crear: boolean
  puede_editar: boolean
  puede_eliminar: boolean
  puede_exportar: boolean
  puede_ejecutar: boolean
}

export interface GrupoPermisoCreatePayload {
  grupo: number
  componente_id: number
  puede_ver: boolean
  puede_crear: boolean
  puede_editar: boolean
  puede_eliminar: boolean
  puede_exportar: boolean
  puede_ejecutar: boolean
}

export interface GrupoPermisoUpdatePayload {
  puede_ver: boolean
  puede_crear: boolean
  puede_editar: boolean
  puede_eliminar: boolean
  puede_exportar: boolean
  puede_ejecutar: boolean
}
