import { MisReservasScreen } from '#/app/features/GestionServiciosyReserva/Cliente_Reservas/screen/MisReservasScreen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/mis-reservas')({
  component: MisReservasScreen,
})
