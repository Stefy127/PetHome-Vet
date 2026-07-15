import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

import {
  useGetClinicalHistoriesQuery,
  useCreateClinicalHistoryMutation,
  type ClinicalHistory,
  type ConsultaClinica,
  type VacunaAplicada,
  type Tratamiento,
} from "../store"

import {
  useGetMascotasQuery,
  useGetClientesMascotaQuery,
} from "@/app/features/Gestionar_Clientes_Mascotas/Gestionar_Mascotas/store/gestionarMascotasApi"

import {
  NuevoHistorialClinicoDialog,
  NuevaConsultaDialog,
  HistorialClinicoDetailDialog,
  EditarHistorialClinicoDialog,
  TratamientoDialog,
  VacunaAplicadaDialog,
  ConsultaClinicaDetailDialog,
} from "../components"
import { useCanCreate } from "@/store/auth/auth.hooks"
import {
  StatsSection,
  FilterSection,
  HistorialesTableSection,
  HistorialesCardsSection,
} from "../components/sections"



export function Gestionar_Historia_Clinica() {
  const [search, setSearch] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")

  const [openNuevoHistorial, setOpenNuevoHistorial] = useState(false)
  const [openNuevaConsulta, setOpenNuevaConsulta] = useState(false)
  const [openEditarConsulta, setOpenEditarConsulta] = useState(false)
  const [openDetalleHistorial, setOpenDetalleHistorial] = useState(false)
  const [openDetalleConsulta, setOpenDetalleConsulta] = useState(false)
  const [openEditarHistorial, setOpenEditarHistorial] = useState(false)

  const canCreate = useCanCreate("CLI_HISTORIALES")

  const [openTratamientoDialog, setOpenTratamientoDialog] = useState(false)
  const [modoTratamiento, setModoTratamiento] = useState<"crear" | "editar">(
    "crear"
  )

  const [openVacunaDialog, setOpenVacunaDialog] = useState(false)
  const [modoVacuna, setModoVacuna] = useState<"crear" | "editar">("crear")

  const [historialSeleccionado, setHistorialSeleccionado] =
    useState<ClinicalHistory | null>(null)

  const [consultaSeleccionada, setConsultaSeleccionada] =
    useState<ConsultaClinica | null>(null)

  const [consultaTratamientoSeleccionada, setConsultaTratamientoSeleccionada] =
    useState<ConsultaClinica | null>(null)

  const [tratamientoSeleccionado, setTratamientoSeleccionado] =
    useState<Tratamiento | null>(null)

  const [consultaVacunaSeleccionada, setConsultaVacunaSeleccionada] =
    useState<ConsultaClinica | null>(null)

  const [vacunaSeleccionada, setVacunaSeleccionada] =
    useState<VacunaAplicada | null>(null)

  const {
    data: historiales = [],
    isLoading,
    isError,
    refetch,
  } = useGetClinicalHistoriesQuery()

  const [createClinicalHistory, { isLoading: isCreatingHistory }] =
    useCreateClinicalHistoryMutation()

  const { data: mascotas = [] } = useGetMascotasQuery()
  const { data: clientes = [] } = useGetClientesMascotaQuery()

  const mascotasAdaptadas = useMemo(() => {
    return mascotas.map((m: any) => ({
      id: m.id_mascota,
      nombre:
        typeof m.nombre === "string"
          ? m.nombre
          : m.nombre?.nombre ?? "",
      propietario_id:
        m.propietario_id ??
        m.id_usuario ??
        m.usuario?.id_usuario ??
        m.usuario?.id ??
        "",
      propietario_nombre:
        m.propietario_nombre ??
        m.usuario_nombre ??
        m.usuario?.perfil?.nombre ??
        m.usuario?.nombre ??
        m.propietario?.perfil?.nombre ??
        m.propietario?.nombre ??
        "",
      especie_nombre:
        typeof m.especie_nombre === "string"
          ? m.especie_nombre
          : typeof m.especie === "string"
            ? m.especie
            : m.especie?.nombre ?? "",
      raza_nombre:
        typeof m.raza_nombre === "string"
          ? m.raza_nombre
          : typeof m.raza === "string"
            ? m.raza
            : m.raza?.nombre ?? "",
    }))
  }, [mascotas])

  const propietariosAdaptados = useMemo(() => {
    return clientes.map((c: any) => ({
      id: c.id_usuario ?? c.id ?? "",
      nombre:
        c.nombre ??
        c.nombre_completo ??
        c.perfil_nombre ??
        c.perfil?.nombre ??
        c.correo ??
        "Cliente",
    }))
  }, [clientes])

  const filteredHistoriales = useMemo(() => {
    return historiales.filter((item: ClinicalHistory) => {
      const texto = search.toLowerCase()

      const coincideBusqueda =
        item.mascota_nombre?.toLowerCase().includes(texto) ||
        item.mascota_especie?.toLowerCase().includes(texto) ||
        item.mascota_raza?.toLowerCase().includes(texto) ||
        item.propietario_nombre?.toLowerCase().includes(texto) ||
        item.observaciones_generales?.toLowerCase().includes(texto)

      const totalConsultas = item.consultas_clinicas?.length || 0

      const coincideEstado =
        filterEstado === "todos" ||
        (filterEstado === "con_consultas" && totalConsultas > 0) ||
        (filterEstado === "sin_consultas" && totalConsultas === 0) ||
        (filterEstado === "activos" && item.estado) ||
        (filterEstado === "inactivos" && !item.estado)

      return coincideBusqueda && coincideEstado
    })
  }, [historiales, search, filterEstado])

  const stats = useMemo(() => {
    const total = historiales.length
    const activos = historiales.filter((item) => item.estado).length
    const totalConsultas = historiales.reduce(
      (acc, item) => acc + (item.consultas_clinicas?.length || 0),
      0
    )

    return {
      total,
      activos,
      totalConsultas,
    }
  }, [historiales])

  const handleNuevaConsulta = (historial: ClinicalHistory) => {
    setHistorialSeleccionado(historial)
    setOpenNuevaConsulta(true)
  }

  const handleVerDetalle = (historial: ClinicalHistory) => {
    setHistorialSeleccionado(historial)
    setOpenDetalleHistorial(true)
  }

  const handleVerDetalleConsulta = (consulta: ConsultaClinica) => {
    setConsultaSeleccionada(consulta)
    setOpenDetalleHistorial(false)
    setOpenDetalleConsulta(true)
  }

  const handleEditarConsulta = (consulta: ConsultaClinica) => {
    setConsultaSeleccionada(consulta)
    setOpenDetalleHistorial(false)
    setOpenEditarConsulta(true)
  }

  const handleEditarHistorial = () => {
    setOpenDetalleHistorial(false)
    setOpenEditarHistorial(true)
  }

  const handleAgregarTratamiento = (consulta: ConsultaClinica) => {
    setConsultaTratamientoSeleccionada(consulta)
    setTratamientoSeleccionado(null)
    setModoTratamiento("crear")
    setOpenDetalleHistorial(false)
    setOpenTratamientoDialog(true)
  }

  const handleEditarTratamiento = (
    consulta: ConsultaClinica,
    tratamiento: Tratamiento
  ) => {
    setConsultaTratamientoSeleccionada(consulta)
    setTratamientoSeleccionado(tratamiento)
    setModoTratamiento("editar")
    setOpenDetalleHistorial(false)
    setOpenTratamientoDialog(true)
  }

  const handleAgregarVacuna = (consulta: ConsultaClinica) => {
    setConsultaVacunaSeleccionada(consulta)
    setVacunaSeleccionada(null)
    setModoVacuna("crear")
    setOpenDetalleHistorial(false)
    setOpenVacunaDialog(true)
  }

  const handleEditarVacuna = (
    consulta: ConsultaClinica,
    vacuna: VacunaAplicada
  ) => {
    setConsultaVacunaSeleccionada(consulta)
    setVacunaSeleccionada(vacuna)
    setModoVacuna("editar")
    setOpenDetalleHistorial(false)
    setOpenVacunaDialog(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="h-10 w-72 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="h-36 animate-pulse rounded-3xl bg-gray-200" />
          <div className="h-36 animate-pulse rounded-3xl bg-gray-200" />
          <div className="h-36 animate-pulse rounded-3xl bg-gray-200" />
        </div>
        <div className="h-96 animate-pulse rounded-3xl bg-gray-200" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <section className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 md:text-5xl">
            Gestionar Historia Clínica
          </h1>
          <p className="text-base text-slate-700 md:text-xl">
            Administra los historiales clínicos y consultas registradas
          </p>
        </section>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600 shadow-sm">
          <p className="text-lg font-semibold">
            No se pudieron cargar los historiales clínicos.
          </p>
          <p className="mt-2 text-sm">
            Revisa que el backend esté levantado y que la ruta
            <span className="font-medium"> /api/gestion/clinica/historiales/ </span>
            responda correctamente.
          </p>

          <Button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-2xl bg-red-600 text-white hover:bg-red-700"
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 md:text-5xl">
            Gestionar Historia Clínica
          </h1>
          <p className="text-base text-slate-700 md:text-xl">
            {canCreate
              ? "Administra los historiales clínicos y consultas registradas"
              : "Consulta la información médica y atenciones de tus mascotas"}
          </p>
        </div>

        {canCreate && (
          <Button
            type="button"
            onClick={() => setOpenNuevoHistorial(true)}
            className="h-14 rounded-2xl bg-orange-500 px-6 text-lg font-semibold text-white hover:bg-orange-600"
          >
            + Nuevo historial
          </Button>
        )}
      </section>

      <StatsSection stats={stats} />

      <FilterSection
        search={search}
        setSearch={setSearch}
        filterEstado={filterEstado}
        setFilterEstado={setFilterEstado}
      />

      <p className="text-lg text-slate-800">
        Mostrando {filteredHistoriales.length} de {historiales.length}{" "}
        historiales
      </p>

      <HistorialesTableSection
        historiales={filteredHistoriales}
        canCreate={canCreate}
        onVerDetalle={handleVerDetalle}
        onNuevaConsulta={handleNuevaConsulta}
      />

      <HistorialesCardsSection
        historiales={filteredHistoriales}
        canCreate={canCreate}
        onVerDetalle={handleVerDetalle}
        onNuevaConsulta={handleNuevaConsulta}
      />

      <NuevoHistorialClinicoDialog
        open={openNuevoHistorial}
        onOpenChange={setOpenNuevoHistorial}
        mascotas={mascotasAdaptadas}
        propietarios={propietariosAdaptados}
        loading={isCreatingHistory}
        onSubmit={async (payload) => {
          await createClinicalHistory(payload).unwrap()
          setOpenNuevoHistorial(false)
        }}
      />

          <NuevaConsultaDialog
          open={openNuevaConsulta}
            onOpenChange={setOpenNuevaConsulta}
             idHistorialClinico={historialSeleccionado?.id_historial_clinico ?? null}
             nombreMascota={historialSeleccionado?.mascota_nombre ?? undefined}
       />

        <NuevaConsultaDialog
         open={openEditarConsulta}
          onOpenChange={setOpenEditarConsulta}
         idHistorialClinico={historialSeleccionado?.id_historial_clinico ?? null}
         nombreMascota={historialSeleccionado?.mascota_nombre ?? undefined}
          modo="editar"
           consultaInicial={consultaSeleccionada}
        />

      <EditarHistorialClinicoDialog
        open={openEditarHistorial}
        onOpenChange={setOpenEditarHistorial}
        historial={historialSeleccionado}
      />

      <TratamientoDialog
        open={openTratamientoDialog}
        onOpenChange={setOpenTratamientoDialog}
        consulta={consultaTratamientoSeleccionada}
        modo={modoTratamiento}
        tratamientoInicial={tratamientoSeleccionado}
      />

      <VacunaAplicadaDialog
        open={openVacunaDialog}
        onOpenChange={setOpenVacunaDialog}
        consulta={consultaVacunaSeleccionada}
        modo={modoVacuna}
        vacunaInicial={vacunaSeleccionada}
      />

      <HistorialClinicoDetailDialog
        open={openDetalleHistorial}
        onOpenChange={setOpenDetalleHistorial}
        historial={historialSeleccionado}
        onEditarConsulta={handleEditarConsulta}
        onEditarHistorial={handleEditarHistorial}
        onAgregarTratamiento={handleAgregarTratamiento}
        onEditarTratamiento={handleEditarTratamiento}
        onAgregarVacuna={handleAgregarVacuna}
        onEditarVacuna={handleEditarVacuna}
        onVerDetalleConsulta={handleVerDetalleConsulta}
      />

      <ConsultaClinicaDetailDialog
        open={openDetalleConsulta}
        onOpenChange={setOpenDetalleConsulta}
        consulta={consultaSeleccionada}
      />
    </div>
  )
}