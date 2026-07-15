import type { VentaCreatePayload, VentaFormValues } from '../types/ventas.types'

type ApiError = {
  status?: number | string
  data?: unknown
}

function extractMessageFromUnknown(data: unknown): string | null {
  if (!data) return null

  if (typeof data === 'string') {
    return data.trim() || null
  }

  if (typeof data === 'object') {
    const record = data as Record<string, unknown>
    const detail = record.detail
    if (typeof detail === 'string' && detail.trim()) {
      return detail.trim()
    }

    const messages = Object.values(record)
      .flatMap((value) => {
        if (typeof value === 'string') return [value]
        if (Array.isArray(value)) {
          return value.filter((entry): entry is string => typeof entry === 'string')
        }
        return []
      })
      .map((value) => value.trim())
      .filter(Boolean)

    if (messages.length > 0) return messages.join(' ')
  }

  return null
}

function mapBackendMessage(message: string) {
  const normalized = message.toLowerCase()
  if (normalized.includes('stock')) {
    return 'Stock insuficiente para uno o más productos seleccionados.'
  }
  if (normalized.includes('almac') && normalized.includes('principal')) {
    return 'No existe almacén principal configurado para registrar la venta.'
  }
  if (normalized.includes('mascota') && normalized.includes('cliente')) {
    return 'La mascota seleccionada no pertenece al cliente elegido.'
  }
  if (normalized.includes('mascota') && normalized.includes('servicio')) {
    return 'Los servicios requieren una mascota asociada.'
  }
  if (normalized.includes('precio') && normalized.includes('servicio')) {
    return 'El precio de servicio seleccionado no está disponible.'
  }
  if (normalized.includes('producto') && normalized.includes('precio')) {
    return 'El producto no tiene un precio válido para la venta.'
  }
  if (normalized.includes('permiso') || normalized.includes('autoriz')) {
    return 'No tienes permisos para registrar o consultar ventas.'
  }
  return message
}

function parsePositiveInt(value: string) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return null
  return parsed
}

export function hasServiceInDetails(values: VentaFormValues) {
  return values.detalles.some((detalle) => detalle.tipo_item === 'SERVICIO')
}

export function validateVentaForm(values: VentaFormValues) {
  const errors: string[] = []
  const details = values.detalles

  if (!details.length) {
    errors.push('Debe agregar al menos un detalle de venta.')
  }

  details.forEach((detalle, index) => {
    const row = index + 1
    if (!detalle.tipo_item) {
      errors.push(`Fila ${row}: seleccione el tipo de ítem.`)
      return
    }

    const cantidad = parsePositiveInt(detalle.cantidad)
    if (!cantidad) {
      errors.push(`Fila ${row}: la cantidad debe ser mayor a 0.`)
    }

    if (detalle.tipo_item === 'PRODUCTO') {
      if (!parsePositiveInt(detalle.producto)) {
        errors.push(`Fila ${row}: seleccione un producto.`)
      }
      return
    }

    if (!parsePositiveInt(detalle.servicio)) {
      errors.push(`Fila ${row}: seleccione un servicio.`)
    }
    if (!parsePositiveInt(detalle.precio_servicio)) {
      errors.push(`Fila ${row}: seleccione un precio de servicio.`)
    }
  })

  if (hasServiceInDetails(values) && !parsePositiveInt(values.mascota)) {
    errors.push('Debe seleccionar una mascota cuando la venta incluye servicios.')
  }

  return errors
}

export function buildVentaCreatePayload(values: VentaFormValues): VentaCreatePayload {
  const payload: VentaCreatePayload = {
    cliente: parsePositiveInt(values.cliente),
    mascota: parsePositiveInt(values.mascota),
    observacion: values.observacion.trim(),
    detalles: values.detalles.map((detalle) => {
      if (detalle.tipo_item === 'PRODUCTO') {
        return {
          tipo_item: 'PRODUCTO',
          producto: parsePositiveInt(detalle.producto) ?? 0,
          cantidad: String(parsePositiveInt(detalle.cantidad) ?? 1),
        }
      }

      return {
        tipo_item: 'SERVICIO',
        servicio: parsePositiveInt(detalle.servicio) ?? 0,
        precio_servicio: parsePositiveInt(detalle.precio_servicio) ?? 0,
        cantidad: String(parsePositiveInt(detalle.cantidad) ?? 1),
      }
    }),
  }

  return payload
}

export function getVentasApiErrorMessage(error: unknown, fallback: string) {
  const apiError = error as ApiError
  const status = apiError.status
  const message = extractMessageFromUnknown(apiError.data)

  if (status === 401) {
    return 'Su sesión expiró. Vuelva a iniciar sesión.'
  }
  if (status === 403) {
    return 'No tienes permisos para realizar esta acción.'
  }
  if (status === 'FETCH_ERROR') {
    return 'No se pudo conectar con el backend.'
  }

  if (message) {
    return mapBackendMessage(message)
  }

  return fallback
}
