import { Card, CardContent } from "@/components/ui/card"
import type { ConsultaClinica } from "../../store"

interface Props {
  consulta: ConsultaClinica
}

export function DiagnosticoSection({ consulta }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
            Motivo de consulta
          </p>
          <p className="mt-3 text-base leading-7 text-slate-700">
            {consulta.motivo_consulta || "Sin motivo"}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
            Diagnóstico
          </p>
          <p className="mt-3 text-base leading-7 text-slate-700">
            {consulta.diagnostico || "Sin diagnóstico"}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm md:col-span-2">
        <CardContent className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
            Observaciones
          </p>
          <p className="mt-3 text-base leading-7 text-slate-700">
            {consulta.observaciones || "Sin observaciones"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
