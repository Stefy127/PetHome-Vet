export type UserRole =
  | 'Administrador'
  | 'Veterinario'
  | 'Recepcionista'
  | 'Cliente';
export type UserStatus = 'Activo' | 'Inactivo';

export interface Usuario {
  id: number;
  id_usuario?: number;
  id_veterinaria?: number | null;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  rol: UserRole;
  estado: UserStatus;
  creadoEn: string;
}

export interface UsuarioFormData {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  rol: UserRole;
  estado: UserStatus;
}
