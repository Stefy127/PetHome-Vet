import type { Cita, Mascota, PrecioServicio } from '../store/cliente.types'
import type { Coordinates, ReservaFormState } from './types'

export const initialReservaForm: ReservaFormState = {
  mascota: '',
  servicio: '',
  precio_servicio: '',
  fecha_programada: '',
  hora_inicio: '',
  modalidad: 'CLINICA',
  direccion_cita: '',
  descripcion: '',
}

export const HORAS_RESERVA = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

export function isFutureDateTime(date: string, time: string) {
  if (!date || !time) return false

  const selectedDate = new Date(`${date}T${time}`)
  return selectedDate.getTime() > Date.now()
}

export function getApiErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null
  ) {
    const data = error.data as Record<string, unknown>

    if (typeof data.detail === 'string') return data.detail
    if (typeof data.message === 'string') return data.message

    const fieldError = Object.entries(data).find(([, value]) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value),
    )

    if (fieldError) {
      const [field, value] = fieldError
      const message = Array.isArray(value) ? value.join(', ') : String(value)
      return `${field}: ${message}`
    }
  }

  return 'No se pudo completar la operacion. Revisa los datos.'
}

export function getMascotaOwnerId(mascota: Mascota) {
  if (typeof mascota.usuario === 'number') return mascota.usuario
  if (mascota.usuario && typeof mascota.usuario === 'object') {
    return mascota.usuario.id_usuario
  }

  return mascota.usuario_id ?? mascota.id_usuario
}

export function getCitaOwnerMatches(cita: Cita, userId: number, userEmail: string) {
  return cita.usuario === userId || cita.correo_usuario === userEmail
}

export function getPrecioServicioId(precio: PrecioServicio) {
  if (typeof precio.servicio === 'number') return precio.servicio
  if (precio.servicio && typeof precio.servicio === 'object') {
    return precio.servicio.id_servicio
  }

  return precio.servicio_id
}

export function isActive(value: boolean | string | null | undefined) {
  if (value === null || value === undefined) return false
  if (typeof value === 'boolean') return value

  const normalized = value.trim().toUpperCase()
  return normalized === 'ACTIVO' || normalized === 'ACTIVE' || normalized === 'TRUE'
}

export function normalizeModalidad(value: string | null | undefined) {
  if (!value) return ''
  return value.trim().toUpperCase()
}

export function parseCoordinates(value: string | null | undefined): Coordinates | null {
  if (!value) return null

  const directMatch = value.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/)

  if (!directMatch) return null

  const lat = Number(directMatch[1])
  const lng = Number(directMatch[2])

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null

  return { lat, lng }
}

export function formatCoordinates(coords: Coordinates) {
  return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
}

export function buildMapUrl(coords: Coordinates) {
  const bounds = `${coords.lng - 0.01}%2C${coords.lat - 0.01}%2C${
    coords.lng + 0.01
  }%2C${coords.lat + 0.01}`

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`
}

export function buildMapsLink(coords: Coordinates) {
  return `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=16/${coords.lat}/${coords.lng}`
}

export function buildAddressSearchLink(address: string) {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`
}
