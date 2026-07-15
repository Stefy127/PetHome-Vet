export type TipoItemVenta = 'PRODUCTO' | 'SERVICIO'
export type EstadoVenta = 'PENDIENTE_COBRO' | 'ANULADA' | string

export interface PersonaVentaRef {
  id_perfil?: number
  id_usuario?: number
  nombre?: string | null
  correo?: string | null
}

export interface MascotaVentaRef {
  id_mascota?: number
  nombre?: string | null
}

export interface ServicioVentaRef {
  id_servicio?: number
  nombre?: string | null
}

export interface ProductoVentaRef {
  id_producto?: number
  nombre?: string | null
}

export interface PrecioServicioVentaRef {
  id_precio?: number
  variacion?: string | null
  precio?: number | string | null
}

export interface DetalleVenta {
  id_detalle?: number
  id_detalle_venta?: number
  tipo_item?: TipoItemVenta | string | null
  id_producto?: number | null
  producto?: number | ProductoVentaRef | null
  producto_nombre?: string | null
  id_servicio?: number | null
  servicio?: number | ServicioVentaRef | null
  servicio_nombre?: string | null
  id_precio_servicio?: number | null
  precio_servicio?: number | PrecioServicioVentaRef | null
  precio_servicio_nombre?: string | null
  descripcion?: string | null
  descripcion_item?: string | null
  cantidad?: number | string | null
  precio_unitario?: number | string | null
  subtotal?: number | string | null
}

export interface Venta {
  id_venta?: number
  id?: number
  estado_venta?: EstadoVenta | null
  estado?: EstadoVenta | null
  fecha_venta?: string | null
  fecha?: string | null
  created_at?: string | null
  id_cliente?: number | null
  cliente?: number | PersonaVentaRef | null
  cliente_nombre?: string | null
  cliente_correo?: string | null
  id_mascota?: number | null
  mascota?: number | MascotaVentaRef | null
  mascota_nombre?: string | null
  id_usuario_responsable?: number | null
  usuario_responsable?: number | PersonaVentaRef | string | null
  usuario_responsable_nombre?: string | null
  usuario_responsable_correo?: string | null
  usuario?: number | PersonaVentaRef | string | null
  usuario_nombre?: string | null
  observacion?: string | null
  subtotal?: number | string | null
  total?: number | string | null
  detalles?: DetalleVenta[] | null
  detalle_ventas?: DetalleVenta[] | null
}

export interface VentaListPaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: Venta[]
}

export type VentaListResponse = Venta[] | VentaListPaginatedResponse

export interface DetalleVentaCreatePayload {
  tipo_item: TipoItemVenta
  producto?: number
  servicio?: number
  precio_servicio?: number
  cantidad: string
}

export interface VentaCreatePayload {
  cliente: number | null
  mascota: number | null
  observacion: string
  detalles: DetalleVentaCreatePayload[]
}

export interface VentaListFilters {
  estado_venta?: string
  fecha_desde?: string
  fecha_hasta?: string
  cliente?: number
  id_cliente?: number
  mascota?: number
  id_mascota?: number
}

export interface VentaDetalleDraft {
  uid: string
  tipo_item: '' | TipoItemVenta
  producto: string
  servicio: string
  precio_servicio: string
  cantidad: string
}

export interface VentaFormValues {
  cliente: string
  mascota: string
  observacion: string
  detalles: VentaDetalleDraft[]
}

export interface SelectOption {
  id: number
  label: string
}

export interface ClienteVentaOption extends SelectOption {
  userId?: number
}

export interface MascotaVentaOption extends SelectOption {
  ownerUserId?: number
}

export interface ProductoVentaOption extends SelectOption {
  unitPrice: number
}

export interface ServicioOption extends SelectOption {}

export interface PrecioServicioOption extends SelectOption {
  servicioId: number
  unitPrice: number
}
