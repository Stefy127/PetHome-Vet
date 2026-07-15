import { PerfilMascotaScreen } from '#/app/features/Gestionar_Clientes_Mascotas/Perfil_Mascota/screen/PerfilMascota'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/Perfil_Mascota')({
  component: PerfilMascotaPage,
})
function PerfilMascotaPage() {
  return <PerfilMascotaScreen />
}