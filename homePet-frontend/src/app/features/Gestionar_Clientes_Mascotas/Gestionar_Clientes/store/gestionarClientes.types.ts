export interface Cliente {
  id_perfil: number;
  usuario: number;
  correo: string;
  rol: string;
  nombre: string;
  telefono: string;
  direccion: string;
  estado: boolean;
  fecha_creacion: string;
}

export interface ClienteCreatePayload {
  correo: string;
  password?: string; // Necesario para el serializer del backend
  nombre: string;
  telefono?: string;
  direccion?: string;
}

export interface ClienteUpdatePayload {
  nombre?: string;
  telefono?: string;
  direccion?: string;
  // Nota: si bien puedes mandar estado, según el PerfilSerializer 'estado' es read_only 
  // porque viene del modelo User (is_active). Puede requerir manejo extra en backend.
}

export interface ClientesQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  estado?: boolean | string;
}

export interface PaginatedClientesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Cliente[];
}
