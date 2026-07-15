import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Mascota } from "../../Gestionar_Mascotas/types"
import { PawPrint } from "lucide-react"

interface MascotaProfileCardProps {
  mascota: Mascota
  isLoading: boolean
}

function DetailCard({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="rounded-2xl border border-[#FFEDD5] bg-[#FFFDFB] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[#18181B]">
        {value === null || value === undefined || value === ""
          ? "No registrado"
          : String(value)}
      </p>
    </div>
  )
}

function getPesoTexto(peso: number | null | undefined) {
  if (peso === null || peso === undefined) return "No registrado"
  return `${peso} kg`
}

function getTamañoTexto(tamaño: string | null | undefined) {
  if (!tamaño) return "No registrado"
  return tamaño
}

function getSexoTexto(sexo: string | null | undefined) {
  if (!sexo) return "No registrado"
  return sexo === "MACHO" ? "Macho" : "Hembra"
}

function getEstadoTexto(estado: boolean) {
  return estado ? "Activo" : "Inactivo"
}

function formatFecha(fecha: string | null | undefined) {
  if (!fecha) return "No registrado"
  try {
    return new Date(fecha).toLocaleDateString("es-BO")
  } catch {
    return fecha
  }
}

export function MascotaProfileCard({
  mascota,
  isLoading,
}: MascotaProfileCardProps) {
  if (isLoading) {
    return (
      <Card className="border-[#FED7AA] bg-white">
        <CardHeader className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] text-white">
          <CardTitle>Perfil de la Mascota</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-8 animate-pulse rounded bg-gray-200"></div>
            <div className="h-8 animate-pulse rounded bg-gray-200"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#e97426] bg-orange">
      <CardHeader className="bg-gradient-to-r from-[#ff852d] via-[#ff852d] to-[#ff852d] text-white">
        <CardTitle className="flex items-center gap-3 text-white text-2xl font-bold">
          <PawPrint className="w-7 h-7 text-purple-500" />
          {mascota.nombre}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Sección Información General */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-[#7C3AED]">
              Información General
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DetailCard label="Especie" value={mascota.especie?.nombre} />
              <DetailCard label="Raza" value={mascota.raza?.nombre} />
              <DetailCard label="Color" value={mascota.color} />
              <DetailCard label="Sexo" value={getSexoTexto(mascota.sexo)} />
              <DetailCard
                label="Tamaño"
                value={getTamañoTexto(mascota.tamano)}
              />
              <DetailCard label="Peso" value={getPesoTexto(mascota.peso)} />
            </div>
          </div>

          <Separator className="bg-[#FFEDD5]" />

          {/* Sección Fecha y Estado */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-[#7C3AED]">
              Registro
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DetailCard
                label="Fecha de Nacimiento"
                value={formatFecha(mascota.fecha_nac)}
              />
              <DetailCard
                label="Fecha de Registro"
                value={formatFecha(mascota.fecha_registro)}
              />
              <DetailCard label="Estado" value={getEstadoTexto(mascota.estado)} />
              <DetailCard label="Propietario" value={mascota.usuario?.nombre} />
            </div>
          </div>

          <Separator className="bg-[#FFEDD5]" />

          {/* Sección Notas */}
          {(mascota.notas_generales || mascota.alergias) && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase text-[#7C3AED]">
                Información Adicional
              </h3>
              <div className="space-y-3">
                {mascota.alergias && (
                  <div className="rounded-2xl border border-[#FEE2E4] bg-[#FFFBFC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#BE123C]">
                      Alergias
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#18181B]">
                      {mascota.alergias}
                    </p>
                  </div>
                )}
                {mascota.notas_generales && (
                  <div className="rounded-2xl border border-[#DEF7FF] bg-[#F0FBFF] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#0369A1]">
                      Notas Generales
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#18181B]">
                      {mascota.notas_generales}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
