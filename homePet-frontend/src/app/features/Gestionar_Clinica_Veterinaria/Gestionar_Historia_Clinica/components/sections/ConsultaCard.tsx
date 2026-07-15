import { Button } from "@/components/ui/button"
import type { ConsultaClinica, Tratamiento, VacunaAplicada } from "../../store"

interface Props {
  consulta: ConsultaClinica
  index: number
  canCreate: boolean
  onVerDetalleConsulta?: (c: ConsultaClinica) => void
  onEditarConsulta?: (c: ConsultaClinica) => void
  onAgregarTratamiento?: (c: ConsultaClinica) => void
  onEditarTratamiento?: (c: ConsultaClinica, t: Tratamiento) => void
  onAgregarVacuna?: (c: ConsultaClinica) => void
  onEditarVacuna?: (c: ConsultaClinica, v: VacunaAplicada) => void
}

function formatearFecha(fecha?: string | null) {
  if (!fecha) return "Sin fecha"
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function valorTexto(valor?: string | number | null, sufijo = "") {
  if (valor === null || valor === undefined || valor === "") return "No registrado"
  return `${valor}${sufijo}`
}

export function ConsultaCard({
  consulta,
  index,
  canCreate,
  onVerDetalleConsulta,
  onEditarConsulta,
  onAgregarTratamiento,
  onEditarTratamiento,
  onAgregarVacuna,
  onEditarVacuna,
}: Props) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h4 className="text-2xl font-extrabold text-slate-900">Consulta #{index + 1}</h4>
          <p className="mt-2 text-base text-slate-600">{formatearFecha(consulta.fecha_consulta)}</p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
            {consulta.veterinario_nombre || "Sin veterinario"}
          </span>

          <div className="flex flex-wrap gap-2">
            {onVerDetalleConsulta && (
              <Button type="button" variant="outline" className="rounded-xl border-violet-300 text-violet-700 hover:bg-violet-50" onClick={() => onVerDetalleConsulta(consulta)}>
                Ver detalle completo
              </Button>
            )}

            {onEditarConsulta && canCreate && (
              <Button type="button" variant="outline" className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100" onClick={() => onEditarConsulta(consulta)}>
                Editar consulta
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">Motivo de consulta</p>
          <p className="mt-2 text-base leading-7 text-slate-700">{consulta.motivo_consulta || "No registrado"}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">Diagnóstico</p>
          <p className="mt-2 text-base leading-7 text-slate-700">{consulta.diagnostico || "No registrado"}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">Observaciones</p>
          <p className="mt-2 text-base leading-7 text-slate-700">{consulta.observaciones || "Sin observaciones"}</p>
        </div>
      </div>

      <div className="mt-6">
        <h5 className="text-lg font-bold text-slate-900">Datos clínicos</h5>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Peso</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{valorTexto(consulta.peso, " kg")}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Temperatura</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{valorTexto(consulta.temperatura, " °C")}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">F. cardiaca</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{valorTexto(consulta.frecuencia_cardiaca, " lpm")}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">F. respiratoria</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{valorTexto(consulta.frecuencia_respiratoria, " rpm")}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Próxima revisión</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{consulta.proxima_revision ? formatearFecha(consulta.proxima_revision) : "No registrada"}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h5 className="text-lg font-bold text-slate-900">Tratamientos</h5>
          {onAgregarTratamiento && canCreate && (
            <Button type="button" className="rounded-xl bg-orange-500 text-white hover:bg-orange-600" onClick={() => onAgregarTratamiento(consulta)}>
              Agregar tratamiento
            </Button>
          )}
        </div>
        {consulta.tratamientos && consulta.tratamientos.length > 0 ? (
          <div className="mt-4 space-y-3">
            {consulta.tratamientos.map((t) => (
              <div key={t.id_tratamiento} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{t.tipo || "Tratamiento"}</p>
                <p className="mt-1 text-sm text-slate-700">{t.descripcion}</p>
                <p className="mt-2 text-xs text-slate-500">Inicio: {formatearFecha(t.fecha_ini)} | Fin: {formatearFecha(t.fecha_fin)}</p>
                {onEditarTratamiento && canCreate && (
                  <div className="mt-3 flex justify-end">
                    <Button type="button" variant="outline" className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100" onClick={() => onEditarTratamiento(consulta, t)}>
                      Editar tratamiento
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No hay tratamientos registrados.</p>
        )}
      </div>

      <div className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h5 className="text-lg font-bold text-slate-900">Vacunas aplicadas</h5>
          {onAgregarVacuna && canCreate && (
            <Button type="button" className="rounded-xl bg-orange-500 text-white hover:bg-orange-600" onClick={() => onAgregarVacuna(consulta)}>
              Agregar vacuna
            </Button>
          )}
        </div>
        {consulta.vacunas_aplicadas && consulta.vacunas_aplicadas.length > 0 ? (
          <div className="mt-4 space-y-3">
            {consulta.vacunas_aplicadas.map((v) => (
              <div key={v.id_vacuna_aplicada} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{v.nombre_vacuna}</p>
                <p className="mt-1 text-sm text-slate-700">Dosis: {v.dosis} | Fecha: {formatearFecha(v.fecha_aplicada)}</p>
                {onEditarVacuna && canCreate && (
                  <div className="mt-3 flex justify-end">
                    <Button type="button" variant="outline" className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100" onClick={() => onEditarVacuna(consulta, v)}>
                      Editar vacuna
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No hay vacunas registradas.</p>
        )}
      </div>

      <div className="mt-6">
        <h5 className="text-lg font-bold text-slate-900">Receta</h5>
        {consulta.receta ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">{consulta.receta.indicaciones}</p>
            {consulta.receta.detalles && consulta.receta.detalles.length > 0 && (
              <div className="mt-4 space-y-3">
                {consulta.receta.detalles.map((d) => (
                  <div key={d.id_detalle_receta} className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="font-medium text-slate-900">{d.medicamento}</p>
                    <p className="mt-1 text-sm text-slate-600">Dosis: {d.dosis} | Frecuencia: {d.frecuencia}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No hay receta registrada.</p>
        )}
      </div>
    </article>
  )
}
