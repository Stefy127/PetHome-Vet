import { BellRing, CalendarDays, ClipboardList, Package } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'

type SeguimientoKpiCardsProps = {
  citasEnSeguimiento: number
  serviciosEnProceso: number
  pedidosActivos: number
  actualizacionesHoy: number
}

const kpiConfig = [
  {
    key: 'citasEnSeguimiento',
    label: 'Citas en seguimiento',
    icon: CalendarDays,
    valueClassName: 'text-violet-600',
    iconClassName: 'text-violet-500 bg-violet-100',
  },
  {
    key: 'serviciosEnProceso',
    label: 'Servicios en proceso',
    icon: ClipboardList,
    valueClassName: 'text-orange-600',
    iconClassName: 'text-orange-500 bg-orange-100',
  },
  {
    key: 'pedidosActivos',
    label: 'Pedidos activos',
    icon: Package,
    valueClassName: 'text-violet-600',
    iconClassName: 'text-violet-500 bg-violet-100',
  },
  {
    key: 'actualizacionesHoy',
    label: 'Actualizaciones hoy',
    icon: BellRing,
    valueClassName: 'text-orange-600',
    iconClassName: 'text-orange-500 bg-orange-100',
  },
] as const

export function SeguimientoKpiCards(props: SeguimientoKpiCardsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {kpiConfig.map((item) => {
        const Icon = item.icon
        const value = props[item.key]
        return (
          <Card key={item.key} className="border-orange-100">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-full p-3 ${item.iconClassName}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className={`text-4xl font-bold leading-none ${item.valueClassName}`}>{value}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

