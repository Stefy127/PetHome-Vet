import { createFileRoute } from '@tanstack/react-router'
import { Gestionar_Usuarios } from '@/app/features/AutenticacionySeguridad'

export const Route = createFileRoute('/_admin/Gestionar_Usuarios')({
  component: GestionarUsuariosPage,
})

function GestionarUsuariosPage() {
  return <Gestionar_Usuarios />
}
