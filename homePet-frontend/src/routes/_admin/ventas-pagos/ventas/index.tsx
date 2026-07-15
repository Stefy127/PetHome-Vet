import { createFileRoute } from '@tanstack/react-router'
import { ConsultarVentasPage } from '#/app/features/GestiondeVentasyPagos'

export const Route = createFileRoute('/_admin/ventas-pagos/ventas/')({
  component: ConsultarVentasRoute,
})

function ConsultarVentasRoute() {
  return <ConsultarVentasPage />
}
