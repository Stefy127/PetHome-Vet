import type { TipoSeguimiento } from '../types/notificaciones.types'

type StatusMeta = {
  label: string
  badgeClass: string
  dotClass: string
  lineClass: string
}

const defaultMeta: StatusMeta = {
  label: 'Sin estado',
  badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  dotClass: 'bg-slate-400',
  lineClass: 'bg-slate-300',
}

export const seguimientoStatusFlow = [
  'PENDIENTE',
  'CONFIRMADA',
  'ASIGNADA',
  'EN_RUTA',
  'EN_ATENCION',
  'FINALIZADA',
  'CANCELADA',
] as const

export const pedidoStatusFlow = [
  'PENDIENTE',
  'CONFIRMADO',
  'EN_PREPARACION',
  'EN_CAMINO',
  'ENTREGADO',
  'CANCELADO',
] as const

const statusMap: Record<string, StatusMeta> = {
  PENDIENTE: {
    label: 'Pendiente',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    lineClass: 'bg-amber-400',
  },
  CONFIRMADA: {
    label: 'Confirmada',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    lineClass: 'bg-emerald-400',
  },
  ASIGNADA: {
    label: 'Asignada',
    badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500',
    lineClass: 'bg-indigo-400',
  },
  EN_RUTA: {
    label: 'En ruta',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
    lineClass: 'bg-blue-400',
  },
  EN_ATENCION: {
    label: 'En atención',
    badgeClass: 'bg-sky-100 text-sky-700 border-sky-200',
    dotClass: 'bg-sky-500',
    lineClass: 'bg-sky-400',
  },
  FINALIZADA: {
    label: 'Finalizada',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-600',
    lineClass: 'bg-emerald-500',
  },
  CANCELADA: {
    label: 'Cancelada',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    dotClass: 'bg-red-500',
    lineClass: 'bg-red-400',
  },
  CONFIRMADO: {
    label: 'Confirmado',
    badgeClass: 'bg-violet-100 text-violet-700 border-violet-200',
    dotClass: 'bg-violet-500',
    lineClass: 'bg-violet-400',
  },
  EN_PREPARACION: {
    label: 'En preparación',
    badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500',
    lineClass: 'bg-indigo-400',
  },
  EN_CAMINO: {
    label: 'En camino',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    dotClass: 'bg-orange-500',
    lineClass: 'bg-orange-400',
  },
  ENTREGADO: {
    label: 'Entregado',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-600',
    lineClass: 'bg-emerald-500',
  },
  CANCELADO: {
    label: 'Cancelado',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    dotClass: 'bg-red-500',
    lineClass: 'bg-red-400',
  },
}

export function getStatusMeta(status?: string | null): StatusMeta {
  if (!status) return defaultMeta
  return statusMap[status] ?? { ...defaultMeta, label: status }
}

export function getTimelineForType(tipoSeguimiento?: TipoSeguimiento | null) {
  return tipoSeguimiento === 'PEDIDO' ? [...pedidoStatusFlow] : [...seguimientoStatusFlow]
}

