import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, FileText, FileImage, FileArchive, File } from "lucide-react"
import type { ArchivoClinico, ConsultaClinica } from "../../store"
import { resolveMediaUrl } from "../utils"

interface Props {
  archivos: ArchivoClinico[]
  consulta: ConsultaClinica
  canCreate: boolean
  onNuevoArchivo: () => void
  onEditarArchivo: (archivo: ArchivoClinico) => void
  onDesactivarArchivo: (archivo: ArchivoClinico) => void
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

function formatBytes(bytes?: number | null) {
  if (!bytes) return "No registrado"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getArchivoIcon(tipo?: string | null) {
  switch (tipo) {
    case "PDF": return <FileText className="h-5 w-5" />
    case "IMAGEN": return <FileImage className="h-5 w-5" />
    case "WORD": return <FileArchive className="h-5 w-5" />
    default: return <File className="h-5 w-5" />
  }
}

function getArchivoBadgeClass(tipo?: string | null) {
  switch (tipo) {
    case "PDF": return "bg-red-100 text-red-700"
    case "IMAGEN": return "bg-emerald-100 text-emerald-700"
    case "WORD": return "bg-blue-100 text-blue-700"
    default: return "bg-slate-200 text-slate-700"
  }
}

function isImageFile(archivo?: ArchivoClinico | null) {
  if (!archivo) return false
  if (archivo.tipo_archivo === "IMAGEN") return true
  const ext = archivo.extension?.toLowerCase()
  return ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext || "")
}

export function ArchivosListSection({
  archivos,
  consulta,
  canCreate,
  onNuevoArchivo,
  onEditarArchivo,
  onDesactivarArchivo,
}: Props) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold text-slate-900">Archivos clínicos</h3>
          {canCreate && (
            <Button
              type="button"
              onClick={onNuevoArchivo}
              className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
            >
              Agregar archivo
            </Button>
          )}
        </div>

        {archivos.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <p className="text-base font-semibold text-slate-700">
              No hay archivos clínicos registrados
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Adjunta imágenes, PDF, Word u otros archivos para esta consulta.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {archivos.map((archivo) => (
              <div
                key={archivo.id_archivo_clinico}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                {(() => {
                  const archivoUrl = resolveMediaUrl(archivo.archivo)

                  return (
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-1 gap-4">
                    <div className="mt-1 rounded-xl bg-white p-3 text-slate-700 shadow-sm">
                      {getArchivoIcon(archivo.tipo_archivo)}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-slate-900">
                          {archivo.nombre_archivo || "Archivo"}
                        </p>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getArchivoBadgeClass(archivo.tipo_archivo)}`}>
                          {archivo.tipo_archivo || "OTRO"}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${archivo.estado ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                          {archivo.estado ? "Activo" : "Inactivo"}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <p className="text-sm text-slate-700">
                          <span className="font-medium text-slate-900">Extensión:</span> {archivo.extension || "No registrada"}
                        </p>
                        <p className="text-sm text-slate-700">
                          <span className="font-medium text-slate-900">Tamaño:</span> {formatBytes(archivo.tamano_bytes)}
                        </p>
                        <p className="text-sm text-slate-700">
                          <span className="font-medium text-slate-900">Fecha subida:</span> {formatearFecha(archivo.fecha_subida)}
                        </p>
                        <p className="text-sm text-slate-700">
                          <span className="font-medium text-slate-900">Descripción:</span> {archivo.descripcion || "Sin descripción"}
                        </p>
                      </div>

                      {isImageFile(archivo) && archivoUrl && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-violet-600">Vista previa</p>
                          <img src={archivoUrl} alt={archivo.nombre_archivo || "Vista previa"} className="max-h-52 rounded-2xl border border-slate-200 object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:w-[180px]">
                    {archivoUrl && (
                      <a href={archivoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-300 px-4 py-2 text-sm text-violet-700 hover:bg-violet-50">
                        <Eye className="h-4 w-4" /> Ver archivo
                      </a>
                    )}
                    {canCreate && (
                      <>
                        <Button type="button" variant="outline" className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100" onClick={() => onEditarArchivo(archivo)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar archivo
                        </Button>
                        <Button type="button" variant="outline" disabled={!archivo.estado} className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onDesactivarArchivo(archivo)}>
                          <Trash2 className="mr-2 h-4 w-4" /> {archivo.estado ? "Desactivar" : "Desactivado"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                  )
                })()}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
