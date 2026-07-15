import { CalendarClock, CircleCheck, FileText, Package2, UserRound } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { SeguimientoDetail } from '../types/notificaciones.types'
import { formatDateTime } from '../utils/formatters'
import { getStatusMeta, getTimelineForType } from '../utils/statusMaps'

type SeguimientoDetailPanelProps = {
  detail?: SeguimientoDetail | null
  isLoading?: boolean
}

function Timeline({
  currentStatus,
  tipoSeguimiento,
}: {
  currentStatus: string
  tipoSeguimiento: string
}) {
  const steps = getTimelineForType(tipoSeguimiento)
  const currentIndex = Math.max(steps.indexOf(currentStatus), 0)

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-gray-900">Línea de avance</p>

      <div className="hidden gap-2 md:flex md:items-center">
        {steps.map((step, index) => {
          const meta = getStatusMeta(step)
          const done = index <= currentIndex
          return (
            <div key={step} className="flex min-w-0 flex-1 items-center gap-2">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  done ? `${meta.lineClass} border-transparent text-white` : 'border-slate-300 bg-white text-slate-400'
                }`}
              >
                {done ? <CircleCheck className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-slate-300" />}
              </div>
              {index !== steps.length - 1 && (
                <div className={`h-1 flex-1 rounded-full ${done ? meta.lineClass : 'bg-slate-200'}`} />
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-2 hidden flex-wrap gap-2 text-center text-[10px] font-semibold text-slate-500 md:flex">
        {steps.map((step) => (
          <span key={step} className="min-w-[72px] flex-1">
            {getStatusMeta(step).label}
          </span>
        ))}
      </div>

      <div className="space-y-3 md:hidden">
        {steps.map((step, index) => {
          const meta = getStatusMeta(step)
          const done = index <= currentIndex
          return (
            <div key={step} className="flex items-center gap-3">
              <div className="flex w-7 flex-col items-center">
                <span className={`h-3 w-3 rounded-full ${done ? meta.dotClass : 'bg-slate-300'}`} />
                {index !== steps.length - 1 && (
                  <span className={`mt-1 h-6 w-[2px] ${done ? meta.lineClass : 'bg-slate-200'}`} />
                )}
              </div>
              <span className={`text-xs font-semibold ${done ? 'text-gray-900' : 'text-gray-500'}`}>{meta.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function SeguimientoDetailPanel({ detail, isLoading }: SeguimientoDetailPanelProps) {
  if (isLoading) {
    return (
      <Card className="h-full border-orange-100">
        <CardContent className="p-5">
          <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-36 animate-pulse rounded bg-slate-100" />
        </CardContent>
      </Card>
    )
  }

  if (!detail) {
    return (
      <Card className="h-full border-orange-100">
        <CardContent className="flex h-full min-h-[300px] items-center justify-center p-6 text-center text-sm text-gray-500">
          Selecciona un seguimiento para ver su detalle.
        </CardContent>
      </Card>
    )
  }

  const currentMeta = getStatusMeta(detail.estado_actual)
  const previousMeta = getStatusMeta(detail.estado_anterior)

  return (
    <Card className="h-full border-orange-100">
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-2xl font-bold text-orange-600">Detalle del seguimiento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-2">
        <div className="rounded-xl border border-orange-100 bg-orange-50/30 p-3">
          <p className="text-sm font-semibold text-gray-900">
            {detail.tipo_seguimiento === 'PEDIDO'
              ? `Pedido PD-${detail.pedido?.id_pedido ?? ''}`
              : `Seguimiento #${detail.id_seguimiento}`}
          </p>
          <p className="text-xs text-gray-500">{detail.usuario?.nombre ?? 'Sin usuario asociado'}</p>
        </div>

        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Estado actual</p>
            <Badge variant="outline" className={currentMeta.badgeClass}>
              {currentMeta.label}
            </Badge>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Estado anterior</p>
            <Badge variant="outline" className={previousMeta.badgeClass}>
              {previousMeta.label}
            </Badge>
          </div>

          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Fecha y hora</p>
            <p className="font-medium text-gray-900">{formatDateTime(detail.fecha_hora)}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Visibilidad cliente</p>
            <p className="font-medium text-gray-900">{detail.visible_cliente ? 'Visible' : 'No visible'}</p>
          </div>
        </div>

        <div className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-sm">
          <p className="flex items-center gap-2 font-semibold text-gray-900">
            <FileText className="h-4 w-4 text-violet-500" />
            Observación
          </p>
          <p className="text-gray-700">{detail.descripcion || 'Sin descripción registrada.'}</p>
        </div>

        <div className="grid gap-2 rounded-xl border border-slate-100 bg-white p-3 text-sm">
          <p className="font-semibold text-gray-900">Datos relacionados</p>
          <p className="flex items-center gap-2 text-gray-700">
            <UserRound className="h-4 w-4 text-violet-500" />
            Cliente: {detail.usuario?.nombre ?? '-'}
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <CalendarClock className="h-4 w-4 text-violet-500" />
            Cita: {detail.cita ? `#${detail.cita.id_cita} - ${detail.cita.estado}` : '-'}
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <Package2 className="h-4 w-4 text-violet-500" />
            Pedido: {detail.pedido ? `#${detail.pedido.id_pedido} - ${detail.pedido.estado_pedido}` : '-'}
          </p>
        </div>

        <Timeline currentStatus={detail.estado_actual} tipoSeguimiento={detail.tipo_seguimiento} />
      </CardContent>
    </Card>
  )
}
