import { createFileRoute } from '@tanstack/react-router'
import { GestionarUnidadesMovilesScreen } from '@/app/features/UnidadesMovilesLogistica'

export const Route = createFileRoute('/_admin/Unidades_Moviles')({
  component: UnidadesMovilesAdminPage,
})

function UnidadesMovilesAdminPage() {
  return <GestionarUnidadesMovilesScreen />
}
