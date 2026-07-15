import type { SeguimientoListItem } from '../types/notificaciones.types'

export function formatDate(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatMoney(amount?: number | null) {
  if (amount === null || amount === undefined) return '-'
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function isTodayDate(value?: string | null) {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export function buildTrackingCode(item: SeguimientoListItem) {
  if (item.tipo_seguimiento === 'CITA' && item.cita?.id_cita) return `CT-${item.cita.id_cita}`
  if (item.tipo_seguimiento === 'SERVICIO' && item.cita?.id_cita) return `SV-${item.cita.id_cita}`
  if (item.tipo_seguimiento === 'PEDIDO' && item.pedido?.id_pedido) return `PD-${item.pedido.id_pedido}`
  return `SG-${item.id_seguimiento}`
}

