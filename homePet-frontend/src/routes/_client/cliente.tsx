import { ClienteHome } from '#/app/features/GestionServiciosyReserva/Cliente_Reservas/screen/ClienteHome'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/cliente')({
  component: ClienteHome,
})
