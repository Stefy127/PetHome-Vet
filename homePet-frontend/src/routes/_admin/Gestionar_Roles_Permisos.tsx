import { createFileRoute } from '@tanstack/react-router'
import { Gestionar_Roles_Permisos } from '@/app/features/AutenticacionySeguridad'

export const Route = createFileRoute('/_admin/Gestionar_Roles_Permisos' as any)({
  component: GestionarRolesPermisosPage,
})

function GestionarRolesPermisosPage() {
  return <Gestionar_Roles_Permisos />
}
