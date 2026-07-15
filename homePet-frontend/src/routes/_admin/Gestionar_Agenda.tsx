import { createFileRoute } from '@tanstack/react-router'
import { Gestionar_Agenda } from '@/app/features/GestionServiciosyReserva/Gestionar_Agenda'

export const Route = createFileRoute('/_admin/Gestionar_Agenda')({
  component: Gestionar_Agenda,
})
