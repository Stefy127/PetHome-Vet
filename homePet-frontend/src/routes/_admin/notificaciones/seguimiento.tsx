import { createFileRoute } from '@tanstack/react-router'
import { SeguimientoScreen } from '@/app/features/NotificacionesySeguimiento'

export const Route = createFileRoute('/_admin/notificaciones/seguimiento')({
  component: SeguimientoScreen,
})

