import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import {
  useUpdateArchivoClinicoMutation,
  type ConsultaClinica,
  type Tratamiento,
  type VacunaAplicada,
  type Receta,
  type DetalleReceta,
  type ArchivoClinico,
} from "../store"

import { TratamientoDialog } from "./TratamientoDialog"
import { VacunaAplicadaDialog } from "./VacunaAplicadaDialog"
import { RecetaDialog } from "./RecetaDialog"
import { DetalleRecetaDialog } from "./DetalleRecetaDialog"
import { ArchivoClinicoDialog } from "./ArchivoClinicoDialog"

import { useCanCreate } from "@/store/auth/auth.hooks"

import {
  ConsultaInfoSection,
  DiagnosticoSection,
  DatosClinicosSection,
  TratamientosListSection,
  VacunasListSection,
  RecetaSection,
  ArchivosListSection,
} from "./sections"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  consulta: ConsultaClinica | null
}

export function ConsultaClinicaDetailDialog({
  open,
  onOpenChange,
  consulta,
}: Props) {
  const [openTratamientoDialog, setOpenTratamientoDialog] = useState(false)
  const [modoTratamiento, setModoTratamiento] = useState<"crear" | "editar">(
    "crear"
  )
  const [tratamientoSeleccionado, setTratamientoSeleccionado] =
    useState<Tratamiento | null>(null)

  const [openVacunaDialog, setOpenVacunaDialog] = useState(false)
  const [modoVacuna, setModoVacuna] = useState<"crear" | "editar">("crear")
  const [vacunaSeleccionada, setVacunaSeleccionada] =
    useState<VacunaAplicada | null>(null)

  const [openRecetaDialog, setOpenRecetaDialog] = useState(false)
  const [modoReceta, setModoReceta] = useState<"crear" | "editar">("crear")
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(
    null
  )

  const [openDetalleRecetaDialog, setOpenDetalleRecetaDialog] = useState(false)
  const [modoDetalleReceta, setModoDetalleReceta] = useState<
    "crear" | "editar"
  >("crear")
  const [detalleRecetaSeleccionado, setDetalleRecetaSeleccionado] =
    useState<DetalleReceta | null>(null)

  const [openArchivoDialog, setOpenArchivoDialog] = useState(false)
  const [modoArchivo, setModoArchivo] = useState<"crear" | "editar">("crear")
  const [archivoSeleccionado, setArchivoSeleccionado] =
    useState<ArchivoClinico | null>(null)

  const [updateArchivoClinico] = useUpdateArchivoClinicoMutation()

  const canCreate = useCanCreate("CLI_HISTORIALES")

  if (!consulta) return null

  const tratamientos = consulta.tratamientos ?? []
  const receta = consulta.receta ?? null
  const vacunas = consulta.vacunas_aplicadas ?? []
  const archivos = consulta.archivos_clinicos ?? []

  const handleNuevoTratamiento = () => {
    setTratamientoSeleccionado(null)
    setModoTratamiento("crear")
    setOpenTratamientoDialog(true)
  }

  const handleEditarTratamiento = (tratamiento: Tratamiento) => {
    setTratamientoSeleccionado(tratamiento)
    setModoTratamiento("editar")
    setOpenTratamientoDialog(true)
  }

  const handleNuevaVacuna = () => {
    setVacunaSeleccionada(null)
    setModoVacuna("crear")
    setOpenVacunaDialog(true)
  }

  const handleEditarVacuna = (vacuna: VacunaAplicada) => {
    setVacunaSeleccionada(vacuna)
    setModoVacuna("editar")
    setOpenVacunaDialog(true)
  }

  const handleNuevaReceta = () => {
    setRecetaSeleccionada(null)
    setModoReceta("crear")
    setOpenRecetaDialog(true)
  }

  const handleEditarReceta = (recetaActual: Receta) => {
    setRecetaSeleccionada(recetaActual)
    setModoReceta("editar")
    setOpenRecetaDialog(true)
  }

  const handleNuevoDetalleReceta = () => {
    if (!receta) return
    setDetalleRecetaSeleccionado(null)
    setModoDetalleReceta("crear")
    setOpenDetalleRecetaDialog(true)
  }

  const handleEditarDetalleReceta = (detalle: DetalleReceta) => {
    if (!receta) return
    setDetalleRecetaSeleccionado(detalle)
    setModoDetalleReceta("editar")
    setOpenDetalleRecetaDialog(true)
  }

  const handleNuevoArchivo = () => {
    setArchivoSeleccionado(null)
    setModoArchivo("crear")
    setOpenArchivoDialog(true)
  }

  const handleEditarArchivo = (archivo: ArchivoClinico) => {
    setArchivoSeleccionado(archivo)
    setModoArchivo("editar")
    setOpenArchivoDialog(true)
  }

  const handleDesactivarArchivo = async (archivo: ArchivoClinico) => {
    if (!archivo.id_archivo_clinico) return

    const confirmado = window.confirm(
      `¿Deseas desactivar el archivo "${archivo.nombre_archivo || "archivo"}"?`
    )
    if (!confirmado) return

    try {
      await updateArchivoClinico({
        idArchivoClinico: archivo.id_archivo_clinico,
        body: {
          estado: false,
          consulta_clinica:
            archivo.consulta_clinica ?? consulta.id_consulta_clinica,
          nombre_archivo: archivo.nombre_archivo ?? "",
          tipo_archivo: archivo.tipo_archivo ?? "OTRO",
          descripcion: archivo.descripcion ?? "",
        },
      }).unwrap()
    } catch (error) {
      console.error(error)
      window.alert("No se pudo desactivar el archivo clínico.")
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!w-[96vw] !max-w-[96vw] sm:!max-w-[1100px] lg:!max-w-[1180px] !p-0 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl">
          <div className="flex max-h-[90vh] flex-col bg-white">
            <DialogHeader className="border-b border-slate-200 bg-white px-6 py-6 md:px-8">
              <DialogTitle className="text-left text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Detalle de consulta clínica
              </DialogTitle>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
                Revisa la información clínica registrada, tratamientos, receta,
                vacunas y archivos asociados.
              </p>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6 md:px-8 md:py-8">
              <div className="space-y-6">
                <ConsultaInfoSection consulta={consulta} />

                <DiagnosticoSection consulta={consulta} />

                <DatosClinicosSection consulta={consulta} />

                <TratamientosListSection
                  tratamientos={tratamientos}
                  canCreate={canCreate}
                  onNuevoTratamiento={handleNuevoTratamiento}
                  onEditarTratamiento={handleEditarTratamiento}
                />

                <VacunasListSection
                  vacunas={vacunas}
                  canCreate={canCreate}
                  onNuevaVacuna={handleNuevaVacuna}
                  onEditarVacuna={handleEditarVacuna}
                />

                <RecetaSection
                  receta={receta}
                  canCreate={canCreate}
                  onNuevaReceta={handleNuevaReceta}
                  onEditarReceta={handleEditarReceta}
                  onNuevoDetalleReceta={handleNuevoDetalleReceta}
                  onEditarDetalleReceta={handleEditarDetalleReceta}
                />

                <ArchivosListSection
                  archivos={archivos}
                  consulta={consulta}
                  canCreate={canCreate}
                  onNuevoArchivo={handleNuevoArchivo}
                  onEditarArchivo={handleEditarArchivo}
                  onDesactivarArchivo={handleDesactivarArchivo}
                />
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

      <TratamientoDialog
        open={openTratamientoDialog}
        onOpenChange={setOpenTratamientoDialog}
        idConsultaClinica={consulta.id_consulta_clinica}
        modo={modoTratamiento}
        tratamientoInicial={tratamientoSeleccionado}
      />

      <VacunaAplicadaDialog
        open={openVacunaDialog}
        onOpenChange={setOpenVacunaDialog}
        idConsultaClinica={consulta.id_consulta_clinica}
        modo={modoVacuna}
        vacunaInicial={vacunaSeleccionada}
      />

      <RecetaDialog
        open={openRecetaDialog}
        onOpenChange={setOpenRecetaDialog}
        idConsultaClinica={consulta.id_consulta_clinica}
        modo={modoReceta}
        recetaInicial={recetaSeleccionada}
      />

      <DetalleRecetaDialog
        open={openDetalleRecetaDialog}
        onOpenChange={setOpenDetalleRecetaDialog}
        receta={receta}
        idReceta={receta?.id_receta ?? null}
        modo={modoDetalleReceta}
        detalleInicial={detalleRecetaSeleccionado}
      />

      <ArchivoClinicoDialog
        open={openArchivoDialog}
        onOpenChange={setOpenArchivoDialog}
        consulta={consulta}
        modo={modoArchivo}
        archivoInicial={archivoSeleccionado}
      />
    </>
  )
}