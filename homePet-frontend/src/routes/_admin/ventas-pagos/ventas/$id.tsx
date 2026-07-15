import { createFileRoute } from '@tanstack/react-router'
import { DetalleVentaPage } from '#/app/features/GestiondeVentasyPagos'

export const Route = createFileRoute('/_admin/ventas-pagos/ventas/$id')({
  component: DetalleVentaRoute,
})

function DetalleVentaRoute() {
  const { id } = Route.useParams()
  const ventaId = Number(id)
  return <DetalleVentaPage ventaId={Number.isNaN(ventaId) ? 0 : ventaId} />
}
