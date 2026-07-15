export type BackendRole = {
  nombre?: string
}

export type BackendAuthUser = {
  id_usuario?: number
  id?: number
  id_veterinaria?: number | null
  correo?: string
  rol?: BackendRole | string
  role?: BackendRole | string
  is_active?: boolean
  date_joined?: string
}

export type BackendUsuario = {
  id_perfil?: number
  id_usuario?: number
  id?: number
  id_veterinaria?: number | null
  nombre?: string
  correo?: string
  telefono?: string
  direccion?: string
  rol?: BackendRole | string
  role?: BackendRole | string
  is_active?: boolean
  estado?: boolean | string
  date_joined?: string
  fecha_creacion?: string
  creado_en?: string
  created_at?: string
  usuario?: BackendAuthUser | number
  perfil?: {
    nombre?: string
    telefono?: string
    direccion?: string
  }
}

export type PaginatedResponse<T> = {
  results?: T[]
  next?: string | null
  data?: T[]
}

