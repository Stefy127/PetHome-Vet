export type CategoriaServicio = {
  id_categoria: number
  nombre: string
  descripcion?: string | null
  estado: boolean
}
export type CategoriaServicioPayload = {
  nombre: string
  descripcion?: string | null
  estado: boolean
}
export type Servicio = {
  id_servicio: number
  nombre: string
  descripcion?: string | null
  categoria: number
  categoria_nombre?: string
  duracion_estimada?: number | null
  disponible_domicilio: boolean
  estado: boolean
}
export type ServicioPayload = {
  nombre: string
  descripcion?: string | null
  categoria: number
  duracion_estimada?: number | null
  disponible_domicilio: boolean
  estado: boolean
}
export type PrecioServicio = {
  id_precio: number
  servicio: number
  servicio_nombre?: string
  variacion: string
  modalidad?: string | null
  precio: number | string
  descripcion?: string | null
  estado: boolean
}
export type PrecioServicioPayload = {
  servicio: number
  variacion: string
  modalidad?: string | null
  precio: number
  descripcion?: string | null
  estado: boolean
}

// =========================
// Especies y Razas
// =========================
export interface Especie {
  id_especie: number
  nombre: string
}
export interface EspeciePayload {
  nombre: string
}

export interface Raza {
  id_raza: number
  nombre: string
  especie: number
  especie_nombre?: string
}
export interface RazaPayload {
  nombre: string
  especie: number
}

export interface ToggleEstadoResponse {
  message: string
  estado: boolean
}
