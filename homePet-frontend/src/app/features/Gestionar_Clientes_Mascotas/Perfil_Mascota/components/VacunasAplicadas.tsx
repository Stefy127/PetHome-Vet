import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { VacunaAplicada } from "../types"

interface VacunasAplicadasProps {
  vacunas: VacunaAplicada[]
  isLoading: boolean
}

function formatFecha(fecha: string | null | undefined) {
  if (!fecha) return "No registrado"
  try {
    return new Date(fecha).toLocaleDateString("es-BO")
  } catch {
    return fecha
  }
}

function getEstadoTexto(estado: boolean) {
  return estado ? "Aplicada" : "Pendiente"
}

function StatusBadge({ estado }: { estado: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        estado
          ? "bg-[#DCFCE7] text-[#166534]"
          : "bg-[#FEF08A] text-[#854D0E]"
      }`}
    >
      {getEstadoTexto(estado)}
    </span>
  )
}

function calcularDiasRestantes(fecha: string | null | undefined): number | null {
  if (!fecha) return null
  try {
    const fechaProxima = new Date(fecha)
    const hoy = new Date()
    const diasRestantes = Math.ceil(
      (fechaProxima.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    )
    return diasRestantes
  } catch {
    return null
  }
}

export function VacunasAplicadas({
  vacunas,
  isLoading,
}: VacunasAplicadasProps) {
  if (isLoading) {
    return (
      <Card className="border-[#FED7AA] bg-white">
        <CardHeader className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] text-white">
          <CardTitle>Vacunas</CardTitle>
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
    <Card className="border-[#FED7AA] bg-white">
      <CardHeader className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] text-white">
        <CardTitle className="flex items-center gap-3">
          <span className="text-2xl">💉</span>
          Vacunas ({vacunas.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {vacunas.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No hay vacunas registradas
          </p>
        ) : (
          <div className="space-y-3">
            {vacunas.map((vacuna) => {
              const diasRestantes = calcularDiasRestantes(vacuna.proxima_dosis)
              const estaProxima = diasRestantes !== null && diasRestantes <= 30

              return (
                <div
                  key={vacuna.id_vacuna_aplicada}
                  className={`rounded-2xl border p-4 ${
                    estaProxima
                      ? "border-[#FEE2E4] bg-[#FFFBFC]"
                      : "border-[#FFEDD5] bg-[#FFFDFB]"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold text-[#18181B]">
                      {vacuna.nombre_vacuna}
                    </h4>
                    <StatusBadge estado={vacuna.estado} />
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                          Fecha de Aplicación
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#18181B]">
                          {formatFecha(vacuna.fecha_aplicacion)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                          Próxima Dosis
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#18181B]">
                          {vacuna.proxima_dosis
                            ? formatFecha(vacuna.proxima_dosis)
                            : "Completada"}
                        </p>
                        {estaProxima && diasRestantes !== null && (
                          <p className="mt-1 text-xs font-semibold text-[#BE123C]">
                            ⚠️ {diasRestantes} días restantes
                          </p>
                        )}
                      </div>
                    </div>

                    {vacuna.veterinario && (
                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                          Veterinario
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#18181B]">
                          {vacuna.veterinario}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
