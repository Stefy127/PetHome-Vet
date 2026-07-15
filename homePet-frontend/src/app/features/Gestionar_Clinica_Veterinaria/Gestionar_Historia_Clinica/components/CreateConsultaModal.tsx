import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  useCreateConsultaClinicaMutation,
  useGetClinicalHistoryByPetQuery,
  useGetVeterinariosQuery,
} from "../store"

interface CreateConsultaModalProps {
  isOpen: boolean
  onClose: () => void
  onConsultaCreada?: () => Promise<void> | void
  citaId: number
  mascotaId: number
  petName: string
}

export function CreateConsultaModal({
  isOpen,
  onClose,
  onConsultaCreada,
  citaId,
  mascotaId,
  petName,
}: CreateConsultaModalProps) {
  const [motivo, setMotivo] = useState("")
  const [diagnostico, setDiagnostico] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [peso, setPeso] = useState("")
  const [temperatura, setTemperatura] = useState("")
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState("")
  const [frecuenciaRespiratoria, setFrecuenciaRespiratoria] = useState("")
  const [selectedVeterinario, setSelectedVeterinario] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { data: historialClinico, isLoading: isLoadingHistorial } = useGetClinicalHistoryByPetQuery(mascotaId, {
    skip: !isOpen || !mascotaId,
  })
  const { data: veterinarios = [] } = useGetVeterinariosQuery()
  const [createConsulta, { isLoading }] = useCreateConsultaClinicaMutation()

  const resetForm = () => {
    setMotivo("")
    setDiagnostico("")
    setObservaciones("")
    setPeso("")
    setTemperatura("")
    setFrecuenciaCardiaca("")
    setFrecuenciaRespiratoria("")
    setSelectedVeterinario("")
    setError(null)
  }

  const handleCreate = async () => {
    setError(null)

    if (!motivo.trim() || !selectedVeterinario) {
      setError("Completa motivo de consulta y selecciona veterinario")
      return
    }

    const resolvedHistorialId = historialClinico?.id_historial_clinico

    if (!resolvedHistorialId) {
      setError("No se encontro historial clinico para la mascota seleccionada")
      return
    }

    try {
      await createConsulta({
        idHistorialClinico: resolvedHistorialId,
        body: {
          cita: citaId,
          usuario_veterinario: Number(selectedVeterinario),
          motivo_consulta: motivo.trim(),
          diagnostico: diagnostico.trim() || undefined,
          observaciones: observaciones.trim() || undefined,
          peso: peso ? Number(peso) : undefined,
          temperatura: temperatura ? Number(temperatura) : undefined,
          frecuencia_cardiaca: frecuenciaCardiaca
            ? Number(frecuenciaCardiaca)
            : undefined,
          frecuencia_respiratoria: frecuenciaRespiratoria
            ? Number(frecuenciaRespiratoria)
            : undefined,
          fecha_consulta: new Date().toISOString(),
        },
      }).unwrap()

      await onConsultaCreada?.()

      resetForm()
      onClose()
    } catch (err: any) {
      setError(err?.data?.error || "Error al crear consulta")
    }
  }

  if (!isOpen) return null

  if (isLoadingHistorial) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-violet-200 bg-white p-6 text-center shadow-2xl">
          <p className="text-sm text-gray-700">Buscando historial clínico de la mascota...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-violet-200 bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] px-6 py-4 text-white">
          <h2 className="text-xl font-bold">Crear Consulta Clínica</h2>
          <p className="text-sm text-violet-100">Mascota: {petName}</p>
        </div>

        <div className="space-y-4 p-6">
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Veterinario *
            </label>
            <select
              value={selectedVeterinario}
              onChange={(e) => setSelectedVeterinario(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900"
            >
              <option value="">Selecciona un veterinario</option>
              {veterinarios.map((vet: any) => (
                <option key={vet.id_usuario} value={vet.id_usuario}>
                  {vet.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Motivo de Consulta *
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Describe el motivo de la consulta"
              className="min-h-24 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Diagnóstico
            </label>
            <textarea
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              placeholder="Diagnóstico preliminar"
              className="min-h-20 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Observaciones adicionales"
              className="min-h-20 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Peso (kg)
              </label>
              <Input
                type="number"
                step="0.1"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="0.0"
                className="text-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Temperatura (°C)
              </label>
              <Input
                type="number"
                step="0.1"
                value={temperatura}
                onChange={(e) => setTemperatura(e.target.value)}
                placeholder="37.0"
                className="text-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                F. Cardiaca (bpm)
              </label>
              <Input
                type="number"
                value={frecuenciaCardiaca}
                onChange={(e) => setFrecuenciaCardiaca(e.target.value)}
                placeholder="80"
                className="text-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                F. Respiratoria
              </label>
              <Input
                type="number"
                value={frecuenciaRespiratoria}
                onChange={(e) => setFrecuenciaRespiratoria(e.target.value)}
                placeholder="20"
                className="text-gray-900"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button
              className="flex-1 bg-slate-200 text-slate-900 hover:bg-slate-300"
              onClick={() => {
                resetForm()
                onClose()
              }}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
              onClick={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Crear Consulta"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}