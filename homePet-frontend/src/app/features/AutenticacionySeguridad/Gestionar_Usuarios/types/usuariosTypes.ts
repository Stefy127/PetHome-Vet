import type { PerfilUsuario } from '../schemas'

export interface UsuariosState {
  lista: PerfilUsuario[]
  isLoading: boolean
  error: string | null
}

export interface UsuariosQueryParams {
  search?: string
  usuario__is_active?: boolean
  usuario__role__nombre?: string
}

export interface UsuarioCreateInput {
  correo: string
  password?: string
  id_rol: number
  nombre: string
  telefono: string
  direccion: string
}

export type UsuarioUpdateInput = Partial<UsuarioCreateInput> & {
  estado?: boolean
}
