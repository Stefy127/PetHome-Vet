import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type {
  HistorialClinico,
  Tratamiento,
} from "../types"

interface HistorialClinicoTratamientosProps {
  historial: HistorialClinico | null
  tratamientos: Tratamiento[]
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
  return estado ? "Activo" : "Inactivo"
}

function StatusBadge({ estado }: { estado: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        estado
          ? "bg-[#DCFCE7] text-[#166534]"
          : "bg-[#FEE2E4] text-[#BE123C]"
      }`}
    >
      {getEstadoTexto(estado)}
    </span>
  )
}

export function HistorialClinicoTratamientos({
  historial,
  tratamientos,
  isLoading,
}: HistorialClinicoTratamientosProps) {
  if (isLoading) {
    return (
      <Card className="border-[#FED7AA] bg-white">
        <CardHeader className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] text-white">
          <CardTitle>Historial Clínico</CardTitle>
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

  if (!historial) {
    return (
      <Card className="border-[#FED7AA] bg-white">
        <CardHeader className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] text-white">
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl"></span>
            Historial Clínico
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-sm text-gray-500">
            No existe historial clínico para esta mascota
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#FED7AA] bg-white">
      <CardHeader className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] text-white">
        <CardTitle className="flex items-center gap-3">
          <span className="text-2xl"></span>
          Historial Clínico
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Información del Historial */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-[#7C3AED]">
              Información del Historial
            </h3>
            <div className="space-y-3">
              <div className="rounded-2xl border border-[#FFEDD5] bg-[#FFFDFB] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                  Fecha de Registro
                </p>
                <p className="mt-2 text-sm font-medium text-[#18181B]">
                  {formatFecha(historial.fecha_registro)}
                </p>
              </div>

              {historial.diagnostico && (
                <div className="rounded-2xl border border-[#FFEDD5] bg-[#FFFDFB] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                    Diagnóstico
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#18181B]">
                    {historial.diagnostico}
                  </p>
                </div>
              )}

              {historial.notas && (
                <div className="rounded-2xl border border-[#DEF7FF] bg-[#F0FBFF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0369A1]">
                    Notas
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#18181B]">
                    {historial.notas}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between rounded-2xl border border-[#FFEDD5] bg-[#FFFDFB] p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                  Estado
                </span>
                <StatusBadge estado={historial.estado} />
              </div>
            </div>
          </div>

          <Separator className="bg-[#FFEDD5]" />

          {/* Tratamientos */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-[#7C3AED]">
              Tratamientos ({tratamientos.length})
            </h3>

            {tratamientos.length === 0 ? (
              <p className="text-center text-sm text-gray-500">
                No hay tratamientos registrados
              </p>
            ) : (
              <div className="space-y-3">
                {tratamientos.map((tratamiento, index) => (
                  <div
                    key={tratamiento.id_tratamiento}
                    className="rounded-2xl border border-[#FFEDD5] bg-[#FFFDFB] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-semibold text-[#18181B]">
                        {index + 1}. {tratamiento.nombre}
                      </h4>
                      <StatusBadge estado={tratamiento.estado} />
                    </div>

                    {tratamiento.descripcion && (
                      <p className="mb-3 text-sm text-gray-600">
                        {tratamiento.descripcion}
                      </p>
                    )}

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <div className="text-xs">
                        <span className="font-semibold text-[#7C3AED]">
                          Fecha Inicio:{" "}
                        </span>
                        <span className="text-[#18181B]">
                          {formatFecha(tratamiento.fecha_inicio)}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="font-semibold text-[#7C3AED]">
                          Fecha Fin:{" "}
                        </span>
                        <span className="text-[#18181B]">
                          {tratamiento.fecha_fin
                            ? formatFecha(tratamiento.fecha_fin)
                            : "En progreso"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
