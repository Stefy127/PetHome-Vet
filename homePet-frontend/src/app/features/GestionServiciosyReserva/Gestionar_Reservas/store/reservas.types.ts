export type ModalidadReserva = 'CLINICA' | 'DOMICILIO'
export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA'

export interface Reserva {
  id_cita: number
  usuario: number
  correo_usuario: string
  mascota: number
  mascota_nombre?: string
  servicio: number
  servicio_nombre?: string
  precio_servicio: number
  precio?: string
  fecha_generada?: string
  fecha_confirmacion?: string | null
  fecha_programada: string
  hora_inicio: string
  hora_fin?: string | null
  modalidad: ModalidadReserva
  direccion_cita?: string | null
  descripcion?: string | null
  estado: EstadoReserva
  motivo_cancelacion?: string | null
}

export interface MascotaOption {
  id_mascota: number
  nombre: string
}

export interface ServicioOption {
  id_servicio: number
  nombre: string
  estado: boolean
}

export interface PrecioServicioOption {
  id_precio: number
  servicio: number
  variacion: string
  modalidad: ModalidadReserva
  precio: string
  estado: boolean
}

export interface ReservaPatchPayload {
  mascota?: number
  servicio?: number
  precio_servicio?: number
  fecha_programada?: string
  hora_inicio?: string
  modalidad?: ModalidadReserva
  direccion_cita?: string | null
  descripcion?: string
}

export interface ReservaEstadoPayload {
  estado: EstadoReserva
  motivo_cancelacion?: string
}
