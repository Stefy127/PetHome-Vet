import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Card, CardContent } from '#/components/ui/card'
import { useGetClientesQuery } from '#/app/features/Gestionar_Clientes_Mascotas/Gestionar_Clientes/store/gestionarClientesApi'
import { useGetMascotasQuery } from '#/app/features/Gestionar_Clientes_Mascotas/Gestionar_Mascotas/store/gestionarMascotasApi'
import { useGetServiciosQuery, useGetPreciosServicioQuery } from '#/app/features/GestionServiciosyReserva/GestionarServiciosPreciosCatalogo/store/GestionarServiciosPreciosCatalogoApi'
import { useGetProductosQuery } from '#/store/inventario/productosApi'
import { useAppSelector } from '#/store/hooks'
import { VentaForm } from '../components/VentaForm'
import { useCreateVentaMutation } from '../services/ventasService'
import type {
  ClienteVentaOption,
  MascotaVentaOption,
  PrecioServicioOption,
  ProductoVentaOption,
  ServicioOption,
  VentaCreatePayload,
} from '../types/ventas.types'
import { formatCurrencyBs, getVentaId } from '../utils/ventasFormatters'
import { canAccessVentasModule } from '../utils/ventasGuards'
import { getVentasApiErrorMessage } from '../utils/ventasValidators'

type InfoCardProps = {
  title: string
  description?: string
  value?: string
}

function InfoCard({ title, description, value }: InfoCardProps) {
  return (
    <Card className="border-violet-100">
      <CardContent className="space-y-2 p-4">
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        {value ? (
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {value}
          </span>
        ) : null}
        {description ? <p className="text-sm font-semibold text-slate-800">{description}</p> : null}
      </CardContent>
    </Card>
  )
}

export function RegistrarVentaPage() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const canAccess = canAccessVentasModule(user)

  const clientesQuery = useGetClientesQuery({ page: 1, page_size: 200 }, { skip: !canAccess })
  const mascotasQuery = useGetMascotasQuery(undefined, { skip: !canAccess })
  const productosQuery = useGetProductosQuery(undefined, { skip: !canAccess })
  const serviciosQuery = useGetServiciosQuery(undefined, { skip: !canAccess })
  const preciosQuery = useGetPreciosServicioQuery(undefined, { skip: !canAccess })
  const [createVenta, { isLoading: isSubmitting }] = useCreateVentaMutation()

  const clientes = useMemo<ClienteVentaOption[]>(() => {
    const rows = clientesQuery.data?.results ?? []
    return rows.map((cliente) => ({
      id: cliente.usuario,
      label: cliente.nombre || cliente.correo || `Cliente ${cliente.id_perfil}`,
      userId: cliente.usuario,
    }))
  }, [clientesQuery.data])

  const mascotas = useMemo<MascotaVentaOption[]>(() => {
    const rows = mascotasQuery.data ?? []
    return rows.map((mascota) => ({
      id: mascota.id_mascota,
      label: mascota.nombre,
      ownerUserId: mascota.usuario?.id_usuario,
    }))
  }, [mascotasQuery.data])

  const productos = useMemo<ProductoVentaOption[]>(() => {
    const rows = productosQuery.data ?? []
    return rows
      .filter((producto) => producto.estado === 'Activo')
      .map((producto) => ({
        id: producto.id_producto,
        label: producto.nombre,
        unitPrice: Number(producto.precio_venta) || 0,
      }))
  }, [productosQuery.data])

  const servicios = useMemo<ServicioOption[]>(() => {
    const rows = serviciosQuery.data ?? []
    return rows
      .filter((servicio) => servicio.estado)
      .map((servicio) => ({
        id: servicio.id_servicio,
        label: servicio.nombre,
      }))
  }, [serviciosQuery.data])

  const preciosServicio = useMemo<PrecioServicioOption[]>(() => {
    const rows = preciosQuery.data ?? []
    return rows
      .filter((precio) => precio.estado)
      .map((precio) => ({
        id: precio.id_precio,
        servicioId: precio.servicio,
        label: `${precio.variacion} · ${formatCurrencyBs(precio.precio)}`,
        unitPrice: Number(precio.precio) || 0,
      }))
  }, [preciosQuery.data])

  const hasQueryError =
    Boolean(clientesQuery.error) ||
    Boolean(mascotasQuery.error) ||
    Boolean(productosQuery.error) ||
    Boolean(serviciosQuery.error) ||
    Boolean(preciosQuery.error)

  const handleSubmit = async (
    payload: VentaCreatePayload,
    context: { hasProducts: boolean },
  ) => {
    try {
      const response = await createVenta(payload).unwrap()
      toast.success('Venta registrada correctamente.')
      if (context.hasProducts) {
        toast.info('Puede verificar el stock actualizado en el módulo de Control de Inventario.')
      }
      const idVenta = getVentaId(response)
      if (idVenta > 0) {
        navigate({ to: '/ventas-pagos/ventas/$id', params: { id: String(idVenta) } })
        return
      }
      navigate({ to: '/ventas-pagos/ventas' })
    } catch (error) {
      toast.error(getVentasApiErrorMessage(error, 'No se pudo registrar la venta.'))
    }
  }

  if (!canAccess) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-5 text-sm font-medium text-red-700">
          No tiene permisos para acceder al módulo de ventas.
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="space-y-5 text-slate-900">
      <div>
        <h1 className="text-5xl font-black text-slate-900">Registrar venta presencial</h1>
        <p className="mt-1 text-sm text-slate-600">
          Registra productos, servicios o ventas mixtas. La venta quedará pendiente de cobro.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard title="Estado inicial" value="PENDIENTE_COBRO" />
        <InfoCard
          title="Inventario"
          description="El stock se descuenta del almacén principal"
        />
        <InfoCard title="Servicios" description="La mascota es obligatoria si hay servicios" />
      </div>

      {hasQueryError ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-sm text-amber-700">
            Algunos catálogos no pudieron cargarse. Revise permisos o disponibilidad de endpoints.
          </CardContent>
        </Card>
      ) : null}

      <VentaForm
        clientes={clientes}
        mascotas={mascotas}
        productos={productos}
        servicios={servicios}
        preciosServicio={preciosServicio}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
