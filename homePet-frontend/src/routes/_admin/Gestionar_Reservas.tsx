import { createFileRoute } from '@tanstack/react-router'
import { Gestionar_Reservas } from '@/app/features/GestionServiciosyReserva'

export const Route = createFileRoute('/_admin/Gestionar_Reservas')({
  component: GestionarReservasAdminPage,
})

function GestionarReservasAdminPage() {
  return <Gestionar_Reservas />
}
