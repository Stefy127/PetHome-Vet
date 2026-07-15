import type {
  DetalleVenta,
  EstadoVenta,
  Venta,
  VentaListPaginatedResponse,
  VentaListResponse,
} from '../types/ventas.types'

function toNumber(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

export function formatCurrencyBs(value: unknown) {
  const amount = toNumber(value)
  return `Bs ${amount.toFixed(2)}`
}

export function formatDateTime(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function getVentaId(venta?: Venta | null) {
  if (!venta) return 0
  return venta.id_venta ?? venta.id ?? 0
}

export function getVentaEstado(venta?: Venta | null): EstadoVenta {
  return venta?.estado_venta ?? venta?.estado ?? 'PENDIENTE_COBRO'
}

export function getVentaFecha(venta?: Venta | null) {
  return venta?.fecha_venta ?? venta?.fecha ?? venta?.created_at ?? null
}

export function getVentaClienteNombre(venta?: Venta | null) {
  if (!venta) return 'Sin cliente'
  if (venta.cliente_nombre) return venta.cliente_nombre
  if (typeof venta.cliente === 'number') return `Cliente #${venta.cliente}`
  if (venta.cliente && typeof venta.cliente === 'object') {
    return venta.cliente.nombre ?? 'Sin cliente'
  }
  if (venta.cliente_correo) return venta.cliente_correo
  return 'Sin cliente'
}

export function getVentaMascotaNombre(venta?: Venta | null) {
  if (!venta) return '-'
  if (venta.mascota_nombre) return venta.mascota_nombre
  if (typeof venta.id_mascota === 'number' && venta.id_mascota > 0) {
    return `Mascota #${venta.id_mascota}`
  }
  if (venta.mascota && typeof venta.mascota === 'object') {
    return venta.mascota.nombre ?? '-'
  }
  return '-'
}

export function getVentaClienteRefId(venta?: Venta | null) {
  if (!venta) return 0
  if (typeof venta.id_cliente === 'number') return venta.id_cliente
  if (typeof venta.cliente === 'number') return venta.cliente
  if (venta.cliente && typeof venta.cliente === 'object') {
    return venta.cliente.id_usuario ?? venta.cliente.id_perfil ?? 0
  }
  return 0
}

export function getVentaUsuarioResponsableRefId(venta?: Venta | null) {
  if (!venta) return 0

  if (typeof venta.id_usuario_responsable === 'number') return venta.id_usuario_responsable
  if (typeof venta.usuario_responsable === 'number') return venta.usuario_responsable
  if (venta.usuario_responsable && typeof venta.usuario_responsable === 'object') {
    return venta.usuario_responsable.id_usuario ?? venta.usuario_responsable.id_perfil ?? 0
  }

  if (typeof venta.usuario === 'number') return venta.usuario
  if (venta.usuario && typeof venta.usuario === 'object') {
    return venta.usuario.id_usuario ?? venta.usuario.id_perfil ?? 0
  }

  return 0
}

export function getVentaUsuarioNombre(
  venta?: Venta | null,
  options?: { fallbackName?: string | null },
) {
  if (!venta) return options?.fallbackName ?? '-'

  if (venta.usuario_responsable_nombre) return venta.usuario_responsable_nombre
  if (venta.usuario_nombre) return venta.usuario_nombre
  if (venta.usuario_responsable_correo) return venta.usuario_responsable_correo

  if (typeof venta.usuario_responsable === 'string' && venta.usuario_responsable.trim()) {
    return venta.usuario_responsable
  }
  if (venta.usuario_responsable && typeof venta.usuario_responsable === 'object') {
    return venta.usuario_responsable.nombre ?? venta.usuario_responsable.correo ?? options?.fallbackName ?? '-'
  }

  if (typeof venta.usuario === 'string' && venta.usuario.trim()) return venta.usuario
  if (venta.usuario && typeof venta.usuario === 'object') {
    return venta.usuario.nombre ?? venta.usuario.correo ?? options?.fallbackName ?? '-'
  }

  return options?.fallbackName ?? '-'
}

export function getVentaObservacion(venta?: Venta | null) {
  return venta?.observacion ?? null
}

export function getVentaSubtotal(venta?: Venta | null) {
  return toNumber(venta?.subtotal)
}

export function getVentaTotal(venta?: Venta | null) {
  return toNumber(venta?.total)
}

export function getVentaDetalles(venta?: Venta | null) {
  if (!venta) return [] as DetalleVenta[]
  return venta.detalles ?? venta.detalle_ventas ?? []
}

export function getDetalleTipo(detalle: DetalleVenta) {
  return (detalle.tipo_item ?? '').toString().toUpperCase()
}

export function getDetalleCantidad(detalle: DetalleVenta) {
  return toNumber(detalle.cantidad)
}

export function getDetallePrecioUnitario(detalle: DetalleVenta) {
  return toNumber(detalle.precio_unitario)
}

export function getDetalleSubtotal(detalle: DetalleVenta) {
  return toNumber(detalle.subtotal)
}

export function getDetalleDescripcion(detalle: DetalleVenta) {
  const tipo = getDetalleTipo(detalle)
  if (detalle.descripcion_item) return detalle.descripcion_item
  if (tipo === 'PRODUCTO') {
    if (detalle.producto_nombre) return detalle.producto_nombre
    if (detalle.producto && typeof detalle.producto === 'object') {
      return detalle.producto.nombre ?? 'Producto'
    }
    return 'Producto'
  }
  if (tipo === 'SERVICIO') {
    const servicioNombre =
      detalle.servicio_nombre ||
      (typeof detalle.servicio === 'object' && detalle.servicio !== null
        ? detalle.servicio.nombre
        : null) ||
      'Servicio'
    const precioNombre =
      detalle.precio_servicio_nombre ||
      (typeof detalle.precio_servicio === 'object' && detalle.precio_servicio !== null
        ? detalle.precio_servicio.variacion
        : null)
    return precioNombre ? `${servicioNombre} - ${precioNombre}` : servicioNombre
  }
  return detalle.descripcion ?? 'Item'
}

export function hasProductoDetalle(detalles: DetalleVenta[]) {
  return detalles.some((detalle) => getDetalleTipo(detalle) === 'PRODUCTO')
}

export function hasServicioDetalle(detalles: DetalleVenta[]) {
  return detalles.some((detalle) => getDetalleTipo(detalle) === 'SERVICIO')
}

function isPaginatedResponse(value: VentaListResponse): value is VentaListPaginatedResponse {
  return !Array.isArray(value) && Array.isArray(value.results)
}

export function extractVentasRows(response?: VentaListResponse) {
  if (!response) return [] as Venta[]
  if (Array.isArray(response)) return response
  if (isPaginatedResponse(response)) return response.results
  return []
}
