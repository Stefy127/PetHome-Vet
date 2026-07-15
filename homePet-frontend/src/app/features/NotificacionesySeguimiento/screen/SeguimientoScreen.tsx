import { useEffect, useMemo, useState } from 'react'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { ShieldCheck, Workflow } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import { useGetPedidoDetailQuery, useGetPedidosQuery, useGetSeguimientoDetailQuery, useGetSeguimientosQuery } from '../store/notificacionesApi'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PedidoDetailPanel,
  PedidoTable,
  SeguimientoDetailPanel,
  SeguimientoFilters,
  SeguimientoKpiCards,
  SeguimientoTable,
  SeguimientoTabs,
  type SeguimientoTab,
} from '../components'
import { isTodayDate } from '../utils/formatters'

type SeguimientoDraftFilters = {
  estado_actual: string
  visible_cliente: string
  fecha_desde: string
  fecha_hasta: string
}

type PedidoDraftFilters = {
  estado_pedido: string
  tipo_entrega: string
  fecha_desde: string
  fecha_hasta: string
}

const ALL_OPTION = 'ALL'

const initialSeguimientoDraft: SeguimientoDraftFilters = {
  estado_actual: ALL_OPTION,
  visible_cliente: ALL_OPTION,
  fecha_desde: '',
  fecha_hasta: '',
}

const initialPedidoDraft: PedidoDraftFilters = {
  estado_pedido: ALL_OPTION,
  tipo_entrega: ALL_OPTION,
  fecha_desde: '',
  fecha_hasta: '',
}

const seguimientoEstadoOptions = [
  { value: ALL_OPTION, label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'CONFIRMADA', label: 'Confirmada' },
  { value: 'ASIGNADA', label: 'Asignada' },
  { value: 'EN_RUTA', label: 'En ruta' },
  { value: 'EN_ATENCION', label: 'En atención' },
  { value: 'FINALIZADA', label: 'Finalizada' },
  { value: 'CANCELADA', label: 'Cancelada' },
]

const pedidoEstadoOptions = [
  { value: ALL_OPTION, label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'EN_PREPARACION', label: 'En preparación' },
  { value: 'EN_CAMINO', label: 'En camino' },
  { value: 'ENTREGADO', label: 'Entregado' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

const visibleClienteOptions = [
  { value: ALL_OPTION, label: 'Todos' },
  { value: 'true', label: 'Visible' },
  { value: 'false', label: 'No visible' },
]

const tipoEntregaOptions = [
  { value: ALL_OPTION, label: 'Todos' },
  { value: 'DOMICILIO', label: 'Domicilio' },
  { value: 'RECOJO', label: 'Recojo' },
  { value: 'CLINICA', label: 'Clínica' },
]

function getStatusFromError(error?: FetchBaseQueryError | SerializedError) {
  if (!error) return null
  if ('status' in error) return error.status
  return null
}

function getReadableErrorMessage(error?: FetchBaseQueryError | SerializedError, isDetail = false) {
  const status = getStatusFromError(error)
  if (status === 401) return 'Su sesión expiró. Inicie sesión nuevamente.'
  if (status === 403) return 'No tiene autorización para consultar esta información.'
  if (status === 404 && isDetail) return 'Registro no encontrado.'
  if (status === 'FETCH_ERROR') {
    return 'No se pudo obtener la información actualizada. Intente nuevamente.'
  }
  return 'No se pudo cargar la información. Intente nuevamente.'
}

function tabToTipoSeguimiento(tab: SeguimientoTab) {
  if (tab === 'CITAS') return 'CITA'
  if (tab === 'SERVICIOS') return 'SERVICIO'
  if (tab === 'PEDIDOS') return 'PEDIDO'
  return undefined
}

export function SeguimientoScreen() {
  const [activeTab, setActiveTab] = useState<SeguimientoTab>('TODOS')
  const [searchTerm, setSearchTerm] = useState('')

  const [seguimientoDraft, setSeguimientoDraft] = useState<SeguimientoDraftFilters>(initialSeguimientoDraft)
  const [pedidoDraft, setPedidoDraft] = useState<PedidoDraftFilters>(initialPedidoDraft)
  const [appliedSeguimientoFilters, setAppliedSeguimientoFilters] =
    useState<SeguimientoDraftFilters>(initialSeguimientoDraft)
  const [appliedPedidoFilters, setAppliedPedidoFilters] = useState<PedidoDraftFilters>(initialPedidoDraft)

  const [selectedSeguimientoId, setSelectedSeguimientoId] = useState<number | null>(null)
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null)

  const { data: seguimientoKpiData = [] } = useGetSeguimientosQuery()

  const seguimientoQueryArgs = useMemo(
    () => ({
      tipo_seguimiento: tabToTipoSeguimiento(activeTab),
      estado_actual:
        appliedSeguimientoFilters.estado_actual === ALL_OPTION
          ? undefined
          : appliedSeguimientoFilters.estado_actual,
      visible_cliente:
        appliedSeguimientoFilters.visible_cliente === ALL_OPTION
          ? undefined
          : appliedSeguimientoFilters.visible_cliente === 'true',
      fecha_desde: appliedSeguimientoFilters.fecha_desde || undefined,
      fecha_hasta: appliedSeguimientoFilters.fecha_hasta || undefined,
    }),
    [activeTab, appliedSeguimientoFilters],
  )

  const pedidoQueryArgs = useMemo(
    () => ({
      estado_pedido:
        appliedPedidoFilters.estado_pedido === ALL_OPTION ? undefined : appliedPedidoFilters.estado_pedido,
      tipo_entrega:
        appliedPedidoFilters.tipo_entrega === ALL_OPTION ? undefined : appliedPedidoFilters.tipo_entrega,
      fecha_desde: appliedPedidoFilters.fecha_desde || undefined,
      fecha_hasta: appliedPedidoFilters.fecha_hasta || undefined,
    }),
    [appliedPedidoFilters],
  )

  const seguimientoListQuery = useGetSeguimientosQuery(seguimientoQueryArgs, {
    skip: activeTab === 'PEDIDOS',
  })
  const pedidosListQuery = useGetPedidosQuery(pedidoQueryArgs, {
    skip: activeTab !== 'PEDIDOS',
  })

  const seguimientoRows = seguimientoListQuery.data ?? []
  const pedidoRows = pedidosListQuery.data ?? []

  const filteredSeguimientos = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return seguimientoRows
    return seguimientoRows.filter((item) => {
      const source = [
        item.usuario?.nombre,
        item.usuario?.correo,
        item.descripcion,
        item.tipo_seguimiento,
        item.cita?.id_cita,
        item.pedido?.id_pedido,
        item.estado_actual,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return source.includes(term)
    })
  }, [searchTerm, seguimientoRows])

  const filteredPedidos = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return pedidoRows
    return pedidoRows.filter((item) => {
      const source = [item.id_pedido, item.usuario_nombre, item.usuario_correo, item.estado_pedido, item.tipo_entrega]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return source.includes(term)
    })
  }, [pedidoRows, searchTerm])

  useEffect(() => {
    if (activeTab === 'PEDIDOS') return
    if (filteredSeguimientos.length === 0) {
      setSelectedSeguimientoId(null)
      return
    }
    const alreadySelected = filteredSeguimientos.some((item) => item.id_seguimiento === selectedSeguimientoId)
    if (!alreadySelected) {
      setSelectedSeguimientoId(filteredSeguimientos[0].id_seguimiento)
    }
  }, [activeTab, filteredSeguimientos, selectedSeguimientoId])

  useEffect(() => {
    if (activeTab !== 'PEDIDOS') return
    if (filteredPedidos.length === 0) {
      setSelectedPedidoId(null)
      return
    }
    const alreadySelected = filteredPedidos.some((item) => item.id_pedido === selectedPedidoId)
    if (!alreadySelected) {
      setSelectedPedidoId(filteredPedidos[0].id_pedido)
    }
  }, [activeTab, filteredPedidos, selectedPedidoId])

  const seguimientoDetailQuery = useGetSeguimientoDetailQuery(selectedSeguimientoId as number, {
    skip: activeTab === 'PEDIDOS' || selectedSeguimientoId === null,
  })
  const pedidoDetailQuery = useGetPedidoDetailQuery(selectedPedidoId as number, {
    skip: activeTab !== 'PEDIDOS' || selectedPedidoId === null,
  })

  const activeListQuery = activeTab === 'PEDIDOS' ? pedidosListQuery : seguimientoListQuery
  const activeListRows = activeTab === 'PEDIDOS' ? filteredPedidos : filteredSeguimientos
  const activeDetailQuery = activeTab === 'PEDIDOS' ? pedidoDetailQuery : seguimientoDetailQuery

  const isInitialLoading = activeListQuery.isLoading && activeListRows.length === 0
  const listErrorMessage = getReadableErrorMessage(activeListQuery.error)
  const detailErrorMessage = getReadableErrorMessage(activeDetailQuery.error, true)

  const kpis = useMemo(() => {
    const citasEnSeguimiento = seguimientoKpiData.filter((item) => item.tipo_seguimiento === 'CITA').length
    const serviciosEnProceso = seguimientoKpiData.filter((item) => item.tipo_seguimiento === 'SERVICIO').length
    const pedidosActivos = seguimientoKpiData.filter((item) => {
      if (item.tipo_seguimiento !== 'PEDIDO') return false
      const estado = item.pedido?.estado_pedido ?? item.estado_actual
      return estado !== 'ENTREGADO' && estado !== 'CANCELADO'
    }).length
    const actualizacionesHoy = seguimientoKpiData.filter((item) => isTodayDate(item.fecha_hora)).length
    return { citasEnSeguimiento, serviciosEnProceso, pedidosActivos, actualizacionesHoy }
  }, [seguimientoKpiData])

  const handleApplyFilters = () => {
    if (activeTab === 'PEDIDOS') {
      setAppliedPedidoFilters(pedidoDraft)
      return
    }
    setAppliedSeguimientoFilters(seguimientoDraft)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    if (activeTab === 'PEDIDOS') {
      setPedidoDraft(initialPedidoDraft)
      setAppliedPedidoFilters(initialPedidoDraft)
      return
    }
    setSeguimientoDraft(initialSeguimientoDraft)
    setAppliedSeguimientoFilters(initialSeguimientoDraft)
  }

  return (
    <section className="space-y-5 text-gray-900">
      <div className="rounded-2xl border border-violet-100 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-violet-100 p-2">
            <Workflow className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-orange-600">Consultar seguimiento de citas, servicios y pedidos</h1>
            <p className="mt-1 text-xl text-gray-700">
              Visualiza el estado actual e historial de citas, servicios solicitados y pedidos de productos.
            </p>
          </div>
        </div>
      </div>

      <SeguimientoKpiCards {...kpis} />

      <SeguimientoTabs activeTab={activeTab} onChange={setActiveTab} disabled={activeListQuery.isFetching} />

      <SeguimientoFilters
        mode={activeTab === 'PEDIDOS' ? 'pedidos' : 'seguimientos'}
        searchTerm={searchTerm}
        estado={activeTab === 'PEDIDOS' ? pedidoDraft.estado_pedido : seguimientoDraft.estado_actual}
        secondary={activeTab === 'PEDIDOS' ? pedidoDraft.tipo_entrega : seguimientoDraft.visible_cliente}
        fechaDesde={activeTab === 'PEDIDOS' ? pedidoDraft.fecha_desde : seguimientoDraft.fecha_desde}
        fechaHasta={activeTab === 'PEDIDOS' ? pedidoDraft.fecha_hasta : seguimientoDraft.fecha_hasta}
        isLoading={activeListQuery.isFetching}
        estadoOptions={activeTab === 'PEDIDOS' ? pedidoEstadoOptions : seguimientoEstadoOptions}
        secondaryOptions={activeTab === 'PEDIDOS' ? tipoEntregaOptions : visibleClienteOptions}
        onSearchTermChange={setSearchTerm}
        onEstadoChange={(value) => {
          if (activeTab === 'PEDIDOS') {
            setPedidoDraft((prev) => ({ ...prev, estado_pedido: value }))
            return
          }
          setSeguimientoDraft((prev) => ({ ...prev, estado_actual: value }))
        }}
        onSecondaryChange={(value) => {
          if (activeTab === 'PEDIDOS') {
            setPedidoDraft((prev) => ({ ...prev, tipo_entrega: value }))
            return
          }
          setSeguimientoDraft((prev) => ({ ...prev, visible_cliente: value }))
        }}
        onFechaDesdeChange={(value) => {
          if (activeTab === 'PEDIDOS') {
            setPedidoDraft((prev) => ({ ...prev, fecha_desde: value }))
            return
          }
          setSeguimientoDraft((prev) => ({ ...prev, fecha_desde: value }))
        }}
        onFechaHastaChange={(value) => {
          if (activeTab === 'PEDIDOS') {
            setPedidoDraft((prev) => ({ ...prev, fecha_hasta: value }))
            return
          }
          setSeguimientoDraft((prev) => ({ ...prev, fecha_hasta: value }))
        }}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {isInitialLoading ? (
        <LoadingState />
      ) : activeListQuery.isError ? (
        <ErrorState message={listErrorMessage} onRetry={activeListQuery.refetch} />
      ) : activeListRows.length === 0 ? (
        <EmptyState message="No existen citas, servicios o pedidos en seguimiento." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
          <Card className="border-orange-100">
            <CardContent className="space-y-3 p-5">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {activeTab === 'PEDIDOS' ? 'Pedidos activos' : 'Seguimientos recientes'}
                </h2>
                <p className="text-sm text-gray-500">
                  Mostrando {activeListRows.length} registros disponibles
                </p>
              </div>

              {activeTab === 'PEDIDOS' ? (
                <PedidoTable rows={activeListRows} selectedId={selectedPedidoId} onSelect={setSelectedPedidoId} />
              ) : (
                <SeguimientoTable rows={activeListRows} selectedId={selectedSeguimientoId} onSelect={setSelectedSeguimientoId} />
              )}
            </CardContent>
          </Card>

          {activeTab === 'PEDIDOS' ? (
            <div className="space-y-3">
              {pedidoDetailQuery.isError && <ErrorState message={detailErrorMessage} onRetry={pedidoDetailQuery.refetch} />}
              {!pedidoDetailQuery.isError && (
                <PedidoDetailPanel detail={pedidoDetailQuery.data} isLoading={pedidoDetailQuery.isFetching} />
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {seguimientoDetailQuery.isError && (
                <ErrorState message={detailErrorMessage} onRetry={seguimientoDetailQuery.refetch} />
              )}
              {!seguimientoDetailQuery.isError && (
                <SeguimientoDetailPanel detail={seguimientoDetailQuery.data} isLoading={seguimientoDetailQuery.isFetching} />
              )}
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-3 text-sm text-violet-700">
        <p className="flex items-center gap-2 font-medium">
          <ShieldCheck className="h-4 w-4" />
          Regla SaaS: cada usuario visualiza únicamente los seguimientos de su veterinaria y los registros
          permitidos según su rol.
        </p>
      </div>
    </section>
  )
}
