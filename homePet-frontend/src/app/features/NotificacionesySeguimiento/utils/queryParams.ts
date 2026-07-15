import type { FiltrosPedido, FiltrosSeguimiento } from '../types/notificaciones.types'

type Primitive = string | number | boolean | undefined | null
type ParamsRecord = Record<string, Primitive>

function stripEmpty(params: ParamsRecord): Record<string, string | number | boolean> {
  return Object.entries(params).reduce<Record<string, string | number | boolean>>((acc, [key, value]) => {
    if (value === undefined || value === null || value === '') return acc
    acc[key] = value
    return acc
  }, {})
}

export function buildSeguimientosQueryParams(filters: FiltrosSeguimiento = {}) {
  return stripEmpty({
    tipo_seguimiento: filters.tipo_seguimiento,
    estado_actual: filters.estado_actual,
    visible_cliente:
      typeof filters.visible_cliente === 'boolean' ? String(filters.visible_cliente) : undefined,
    fecha_desde: filters.fecha_desde,
    fecha_hasta: filters.fecha_hasta,
    pedido_id: filters.pedido_id,
    cita_id: filters.cita_id,
  })
}

export function buildPedidosQueryParams(filters: FiltrosPedido = {}) {
  return stripEmpty({
    estado_pedido: filters.estado_pedido,
    tipo_entrega: filters.tipo_entrega,
    fecha_desde: filters.fecha_desde,
    fecha_hasta: filters.fecha_hasta,
  })
}

