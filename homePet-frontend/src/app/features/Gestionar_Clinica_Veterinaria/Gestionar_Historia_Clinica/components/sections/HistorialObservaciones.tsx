import { Button } from "@/components/ui/button"
import type { ClinicalHistory } from "../../store"

interface Props {
  historial: ClinicalHistory
  canCreate: boolean
  onEditarHistorial?: () => void
}

export function HistorialObservaciones({
  historial,
  canCreate,
  onEditarHistorial,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
            Observaciones generales
          </p>
          <p className="mt-3 text-base leading-7 text-slate-700">
            {historial.observaciones_generales || "Sin observaciones generales."}
          </p>
        </div>

        {onEditarHistorial && canCreate && (
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
            onClick={onEditarHistorial}
          >
            Editar historial
          </Button>
        )}
      </div>
    </section>
  )
}
