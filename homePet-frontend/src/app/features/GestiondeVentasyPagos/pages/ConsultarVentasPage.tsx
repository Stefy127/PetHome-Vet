import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent } from '#/components/ui/card'
import { useGetClientesQuery } from '#/app/features/Gestionar_Clientes_Mascotas/Gestionar_Clientes/store/gestionarClientesApi'
import { useGetMascotasQuery } from '#/app/features/Gestionar_Clientes_Mascotas/Gestionar_Mascotas/store/gestionarMascotasApi'
import { useAppSelector } from '#/store/hooks'
import { VentasFilters } from '../components/VentasFilters'
import type { VentasFiltersValue } from '../components/VentasFilters'
import { VentasTable } from '../components/VentasTable'
import { useGetVentasQuery } from '../services/ventasService'
import type { VentaListFilters } from '../types/ventas.types'
import { extractVentasRows } from '../utils/ventasFormatters'
import { canAccessVentasModule } from '../utils/ventasGuards'
import { getVentasApiErrorMessage } from '../utils/ventasValidators'

const initialFilters: VentasFiltersValue = {
  estado_venta: '',
  fecha_desde: '',
  fecha_hasta: '',
  cliente: '',
  mascota: '',
}

export function ConsultarVentasPage() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const canAccess = canAccessVentasModule(user)

  const [draftFilters, setDraftFilters] = useState<VentasFiltersValue>(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState<VentasFiltersValue>(initialFilters)

  const clientesQuery = useGetClientesQuery({ page: 1, page_size: 200 }, { skip: !canAccess })
  const mascotasQuery = useGetMascotasQuery(undefined, { skip: !canAccess })

  const queryFilters = useMemo<VentaListFilters | undefined>(() => {
    const next: VentaListFilters = {}

    if (appliedFilters.estado_venta) next.estado_venta = appliedFilters.estado_venta
    if (appliedFilters.fecha_desde) next.fecha_desde = appliedFilters.fecha_desde
    if (appliedFilters.fecha_hasta) next.fecha_hasta = appliedFilters.fecha_hasta
    if (appliedFilters.cliente) {
      const clienteId = Number(appliedFilters.cliente)
      next.cliente = clienteId
      next.id_cliente = clienteId
    }
    if (appliedFilters.mascota) {
      const mascotaId = Number(appliedFilters.mascota)
      next.mascota = mascotaId
      next.id_mascota = mascotaId
    }

    return Object.keys(next).length > 0 ? next : undefined
  }, [appliedFilters])

  const ventasQuery = useGetVentasQuery(queryFilters, { skip: !canAccess })
  const ventas = useMemo(() => extractVentasRows(ventasQuery.data), [ventasQuery.data])

  const clientes = useMemo(() => {
    const rows = clientesQuery.data?.results ?? []
    return rows.map((cliente) => ({
      id: cliente.usuario,
      label: cliente.nombre || cliente.correo || `Cliente ${cliente.id_perfil}`,
    }))
  }, [clientesQuery.data])

  const mascotas = useMemo(() => {
    const rows = mascotasQuery.data ?? []
    return rows.map((mascota) => ({
      id: mascota.id_mascota,
      label: mascota.nombre,
    }))
  }, [mascotasQuery.data])

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
        <h1 className="text-5xl font-black text-slate-900">Consultar ventas</h1>
      </div>

      <VentasFilters
        values={draftFilters}
        clientes={clientes}
        mascotas={mascotas}
        isLoading={ventasQuery.isFetching}
        onChange={setDraftFilters}
        onApply={() => setAppliedFilters(draftFilters)}
        onGoToNewVenta={() => navigate({ to: '/ventas-pagos/ventas/nueva' })}
      />

      {ventasQuery.error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-sm text-red-700">
            {getVentasApiErrorMessage(ventasQuery.error, 'No se pudo cargar el listado de ventas.')}
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900">Historial de ventas</h2>
        <VentasTable
          ventas={ventas}
          isLoading={ventasQuery.isLoading || ventasQuery.isFetching}
          onViewDetail={(id) =>
            navigate({ to: '/ventas-pagos/ventas/$id', params: { id: String(id) } })
          }
        />
      </div>
    </section>
  )
}
