import { createFileRoute } from '@tanstack/react-router'
import { RegistrarVentaPage } from '#/app/features/GestiondeVentasyPagos'

export const Route = createFileRoute('/_admin/ventas-pagos/ventas/nueva')({
  component: RegistrarVentaRoute,
})

function RegistrarVentaRoute() {
  return <RegistrarVentaPage />
}
