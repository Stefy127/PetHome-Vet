import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  type ClinicalHistory,
  type ConsultaClinica,
  type Tratamiento,
  type VacunaAplicada,
} from "../store"
import { useCanCreate } from "@/store/auth/auth.hooks"

interface HistorialClinicoDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  historial: ClinicalHistory | null
  onEditarConsulta?: (consulta: ConsultaClinica) => void
  onEditarHistorial?: () => void
  onAgregarTratamiento?: (consulta: ConsultaClinica) => void
  onEditarTratamiento?: (
    consulta: ConsultaClinica,
    tratamiento: Tratamiento
  ) => void
  onAgregarVacuna?: (consulta: ConsultaClinica) => void
  onEditarVacuna?: (
    consulta: ConsultaClinica,
    vacuna: VacunaAplicada
  ) => void
  onVerDetalleConsulta?: (consulta: ConsultaClinica) => void
}

import {
  HistorialGeneralInfo,
  HistorialObservaciones,
  ConsultaCard,
} from "./sections"

export function HistorialClinicoDetailDialog({
  open,
  onOpenChange,
  historial,
  onEditarConsulta,
  onEditarHistorial,
  onAgregarTratamiento,
  onEditarTratamiento,
  onAgregarVacuna,
  onEditarVacuna,
  onVerDetalleConsulta,
}: HistorialClinicoDetailDialogProps) {
  const consultasOrdenadas = useMemo(() => {
    if (!historial?.consultas_clinicas) return []

    return [...historial.consultas_clinicas].sort((a, b) => {
      const fechaA = new Date(a.fecha_consulta || "").getTime()
      const fechaB = new Date(b.fecha_consulta || "").getTime()
      return fechaA - fechaB
    })
  }, [historial])

  const canCreate = useCanCreate("CLI_HISTORIALES")

  if (!historial) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[96vw] !max-w-[96vw] sm:!max-w-[1200px] lg:!max-w-[1240px] !p-0 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex max-h-[90vh] flex-col bg-white">
          <DialogHeader className="border-b border-slate-200 bg-white px-6 py-6 md:px-8">
            <DialogTitle className="text-left text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Detalle del historial clínico
            </DialogTitle>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
              Revisa la información general del historial y las consultas
              clínicas registradas.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6 md:px-8 md:py-8">
            <div className="space-y-6">
              <HistorialGeneralInfo historial={historial} />

              <HistorialObservaciones
                historial={historial}
                canCreate={canCreate}
                onEditarHistorial={onEditarHistorial}
              />

              <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                    Consultas clínicas
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Historial cronológico de atenciones registradas.
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                  {consultasOrdenadas.length}{" "}
                  {consultasOrdenadas.length === 1 ? "consulta" : "consultas"}
                </span>
              </section>

              {consultasOrdenadas.length > 0 ? (
                <div className="space-y-5">
                  {consultasOrdenadas.map((consulta, index) => (
                    <ConsultaCard
                      key={consulta.id_consulta_clinica}
                      consulta={consulta}
                      index={index}
                      canCreate={canCreate}
                      onVerDetalleConsulta={onVerDetalleConsulta}
                      onEditarConsulta={onEditarConsulta}
                      onAgregarTratamiento={onAgregarTratamiento}
                      onEditarTratamiento={onEditarTratamiento}
                      onAgregarVacuna={onAgregarVacuna}
                      onEditarVacuna={onEditarVacuna}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                  <p className="text-lg font-semibold text-slate-700">
                    No hay consultas clínicas registradas
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Cuando agregues consultas, se mostrarán aquí.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white px-6 py-5 md:px-8">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() => onOpenChange(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}