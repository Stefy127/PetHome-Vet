import type { ClinicalHistory } from "../../store"

interface Props {
  historial: ClinicalHistory
}

export function HistorialGeneralInfo({ historial }: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
            Mascota
          </p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {historial.mascota_nombre || "Sin nombre"}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
            Especie / Raza
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {historial.mascota_especie || "Sin especie"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {historial.mascota_raza || "Sin raza"}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
            Propietario
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {historial.propietario_nombre || "Sin propietario"}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
            Estado
          </p>
          <div className="mt-2">
            <span
              className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${
                historial.estado
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {historial.estado ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
