export interface Bitacora {
  id_bitacora: number;
  id_veterinaria?: number;
  fecha_hora: string;
  id_usuario: number | null;
  nombre_usuario: string;
  correo_usuario?: string;
  accion: string;
  descripcion: string;
  ip: string | null;
  user_agent: string;
  modulo: string | null;
  entidad_tipo: string;
  entidad_id: string;
  resultado: string;
  metadatos: Record<string, any>;
  path?: string;
  method?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BitacoraFilters {
  page?: number;
  descripcion?: string;
  modulo?: string;
  accion?: string;
  resultado?: string;
  fecha_desde?: string; // Formato ISO 8601 (Ej: 2026-04-08)
  fecha_hasta?: string; // Formato ISO 8601 (Ej: 2026-04-08)
}