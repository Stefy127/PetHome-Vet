import { createFileRoute } from '@tanstack/react-router'
import { Gestionar_Catalogo_Servicios_Precios } from '@/app/features/GestionServiciosyReserva/GestionarServiciosPreciosCatalogo'

export const Route = createFileRoute('/_admin/Gestionar_Servicios_Precios_Catalogo')({
  component: GestionarServiciosPreciosCatalogoPage,
})

function GestionarServiciosPreciosCatalogoPage() {
  return <Gestionar_Catalogo_Servicios_Precios />
}
