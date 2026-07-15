import { createFileRoute } from '@tanstack/react-router'
import { RutasProgramadasScreen } from '@/app/features/UnidadesMovilesLogistica'

export const Route = createFileRoute('/_admin/Rutas_Programadas')({
  component: RutasProgramadasAdminPage,
})

function RutasProgramadasAdminPage() {
  return <RutasProgramadasScreen />
}
