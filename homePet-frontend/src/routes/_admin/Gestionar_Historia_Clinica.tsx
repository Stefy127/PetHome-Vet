import { createFileRoute } from "@tanstack/react-router"
import { Gestionar_Historia_Clinica } from "#/app/features/Gestionar_Clinica_Veterinaria"

export const Route = createFileRoute("/_admin/Gestionar_Historia_Clinica")({
  component: GestionarHistoriaClinicaPage,
})

function GestionarHistoriaClinicaPage() {
  return <Gestionar_Historia_Clinica />
}