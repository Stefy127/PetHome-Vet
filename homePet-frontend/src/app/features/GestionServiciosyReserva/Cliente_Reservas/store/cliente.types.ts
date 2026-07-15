export type SexoMascota = 'MACHO' | 'HEMBRA'
export type ModalidadCita = 'CLINICA' | 'DOMICILIO'
export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA'

export interface Especie {
  id_especie: number
  nombre: string
}

export interface Raza {
  id_raza: number
  nombre: string
  especie?: number | { id_especie: number; nombre?: string }
  especie_id?: number
  especie_nombre?: string
}

export interface Mascota {
  id_mascota: number
  usuario?: number | { id_usuario: number; nombre?: string } | null
  usuario_id?: number
  id_usuario?: number
  especie: number | { id_especie: number; nombre?: string }
  especie_nombre?: string
  raza?: number | null
  raza_nombre?: string | null
  nombre: string
  color?: string | null
  sexo?: SexoMascota | null
  fecha_nac?: string | null
  tamano?: string | null
  peso?: string | null
  alergias?: string | null
  notas_generales?: string | null
  estado: boolean
}

export interface MascotaPayload {
  especie_id: number
  raza_id?: number | null
  nombre: string
  color?: string
  sexo?: SexoMascota | ''
  fecha_nac?: string
  tamano?: string
  peso?: string
  alergias?: string
  notas_generales?: string
}

export interface Servicio {
  id_servicio: number
  nombre: string
  descripcion?: string | null
  categoria: number
  categoria_nombre?: string
  duracion_estimada?: number | null
  disponible_domicilio: boolean
  estado: boolean
}

export interface PrecioServicio {
  id_precio: number
  servicio: number | { id_servicio: number; nombre?: string }
  servicio_id?: number
  servicio_nombre?: string
  variacion: string
  modalidad: ModalidadCita | string | null
  precio: string
  descripcion?: string | null
  estado: boolean | string | null
}

export interface Cita {
  id_cita: number
  usuario: number
  correo_usuario: string
  mascota: number
  mascota_nombre?: string
  servicio: number
  servicio_nombre?: string
  precio_servicio: number
  precio?: string
  fecha_programada: string
  hora_inicio: string
  modalidad: ModalidadCita
  direccion_cita?: string | null
  descripcion?: string | null
  estado: EstadoCita
  motivo_cancelacion?: string | null
}

export interface CitaPayload {
  mascota: number
  servicio: number
  precio_servicio: number
  fecha_programada: string
  hora_inicio: string
  modalidad: ModalidadCita
  direccion_cita?: string | null
  descripcion?: string
}
