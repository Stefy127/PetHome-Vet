import { MisMascotasScreen } from '#/app/features/GestionServiciosyReserva/Cliente_Reservas/screen/MisMascotasScreen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/mis-mascotas')({
  component: MisMascotasScreen,
})
