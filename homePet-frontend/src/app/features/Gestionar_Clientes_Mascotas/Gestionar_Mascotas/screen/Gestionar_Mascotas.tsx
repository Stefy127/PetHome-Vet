import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mapMascotaFormToPayload, mascotaInitialValues } from "../store"
import { useGestionarMascotas } from "../store/useGestionarMascotas"
import type { Mascota, MascotaFormValues } from "../types"
import {
  DeleteMascotaConfirmation,
  MascotaDetailsDialog,
  MascotaDialog,
  MascotasTable,
} from "../components"
import { useCanCreate } from "#/store/components/component.hooks"

function getEspecieMascota(mascota: Mascota) {
  return mascota.especie?.nombre ?? ""
}

function getRazaMascota(mascota: Mascota) {
  return mascota.raza?.nombre ?? ""
}

function getNombrePropietario(mascota: Mascota) {
  return mascota.usuario?.nombre ?? ""
}

export function Gestionar_Mascotas() {
  const {
    mascotas,
    clientes,
    especies,
    razas,
    loading,
    createMascota,
    updateMascota,
    deleteMascota,
    loadRazasByEspecie,
  } = useGestionarMascotas()

  const [search, setSearch] = useState("")
  const [filtroEspecie, setFiltroEspecie] = useState("Todas")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const [editingMascota, setEditingMascota] = useState<Mascota | null>(null)
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null)
  const [detailsMascota, setDetailsMascota] = useState<Mascota | null>(null)

  const [formValues, setFormValues] =
    useState<MascotaFormValues>(mascotaInitialValues)

  const mascotasFiltradas = useMemo(() => {
    const term = search.toLowerCase().trim()

    return mascotas.filter((m) => {
      const coincideBusqueda =
        !term ||
        [
          m.nombre ?? "",
          getRazaMascota(m),
          getEspecieMascota(m),
          getNombrePropietario(m),
          m.color ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(term)

      const coincideEspecie =
        filtroEspecie === "Todas" || getEspecieMascota(m) === filtroEspecie

      return coincideBusqueda && coincideEspecie
    })
  }, [mascotas, search, filtroEspecie])

  const totalMascotas = mascotas.length

  const mascotasActivas = useMemo(() => {
    return mascotas.filter((m) => m.estado).length
  }, [mascotas])

  const pesoPromedio = useMemo(() => {
    if (!mascotas.length) return "0.0"
    const total = mascotas.reduce(
      (acc, mascota) => acc + Number(mascota.peso ?? 0),
      0,
    )
    return (total / mascotas.length).toFixed(1)
  }, [mascotas])

  const especiesDisponibles = useMemo(() => {
    const especiesUnicas = Array.from(
      new Set(
        mascotas
          .map((m) => getEspecieMascota(m))
          .filter((especie) => especie && especie.trim() !== ""),
      ),
    )
    return ["Todas", ...especiesUnicas]
  }, [mascotas])

  const handleChange = (
    field: keyof MascotaFormValues,
    value: string | number | boolean,
  ) => {
    setFormValues((prev) => {
      if (field === "id_usuario" || field === "id_especie" || field === "id_raza") {
        return {
          ...prev,
          [field]: value === "" ? "" : Number(value),
        }
      }

      if (field === "peso") {
        return {
          ...prev,
          [field]: value === "" ? "" : Number(value),
        }
      }

      return {
        ...prev,
        [field]: value,
      }
    })
  }

  const resetForm = () => {
    setFormValues(mascotaInitialValues)
    setEditingMascota(null)
  }

  const handleOpenCreate = async () => {
    resetForm()
    await loadRazasByEspecie("")
    setDialogOpen(true)
  }

  const handleEdit = async (mascota: Mascota) => {
    setEditingMascota(mascota)

    const especieId = mascota.especie?.id_especie ?? ""
    const razaId = mascota.raza?.id_raza ?? ""
    const usuarioId = mascota.usuario?.id_usuario ?? ""

    setFormValues({
      id_usuario: usuarioId,
      id_especie: especieId,
      id_raza: razaId,
      nombre: mascota.nombre ?? "",
      color: mascota.color ?? "",
      sexo: mascota.sexo ?? "MACHO",
      fecha_nac: mascota.fecha_nac ?? "",
      tamano: mascota.tamano ?? "Mediano",
      peso: mascota.peso ?? "",
      foto: mascota.foto ?? "",
      alergias: mascota.alergias ?? "",
      notas_generales: mascota.notas_generales ?? "",
      estado: mascota.estado,
    })

    if (especieId) {
      await loadRazasByEspecie(especieId)
    } else {
      await loadRazasByEspecie("")
    }

    setDialogOpen(true)
  }

  const handleDelete = (mascota: Mascota) => {
    setSelectedMascota(mascota)
    setDeleteOpen(true)
  }

  const handleViewDetails = (mascota: Mascota) => {
    setDetailsMascota(mascota)
    setDetailsOpen(true)
  }

  const handleSubmit = async () => {
    if (!formValues.id_usuario) {
      alert("Selecciona un propietario")
      return
    }

    if (!formValues.id_especie) {
      alert("Selecciona una especie")
      return
    }

    if (!formValues.id_raza) {
      alert("Selecciona una raza")
      return
    }

    if (!formValues.nombre.trim()) {
      alert("Completa el nombre de la mascota")
      return
    }

    try {
      const payload = mapMascotaFormToPayload(formValues)

      if (editingMascota) {
        await updateMascota(editingMascota.id_mascota, payload)
      } else {
        await createMascota(payload)
      }

      setDialogOpen(false)
      resetForm()
    } catch (error: any) {
      console.error("Error guardando mascota:", error)

      if (error?.raza_id?.[0]) {
        alert(error.raza_id[0])
        return
      }

      if (error?.detail) {
        alert(error.detail)
        return
      }

      alert("No se pudo guardar la mascota.")
    }
  }

  const confirmDelete = async () => {
    if (!selectedMascota) return

    try {
      await deleteMascota(selectedMascota.id_mascota)
      setSelectedMascota(null)
      setDeleteOpen(false)
    } catch (error) {
      console.error("Error eliminando mascota:", error)
      alert("No se pudo eliminar la mascota.")
    }
  }

  const canCreate = useCanCreate("CLI_MASCOTAS")

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-6 py-8 md:px-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-[#F97316]">
            Gestionar Mascotas
          </h1>
          <p className="mt-2 text-lg text-[#18181B]">
            Administra el registro de mascotas de tus clientes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-[#FED7AA] bg-white px-6 py-7 shadow-sm">
            <p className="text-lg text-[#18181B]">Total mascotas</p>
            <h2 className="mt-2 text-5xl font-bold text-[#7C3AED]">
              {totalMascotas}
            </h2>
          </div>

          <div className="rounded-3xl border border-[#FED7AA] bg-white px-6 py-7 shadow-sm">
            <p className="text-lg text-[#18181B]">Mascotas activas</p>
            <h2 className="mt-2 text-5xl font-bold text-[#F97316]">
              {mascotasActivas}
            </h2>
          </div>

          <div className="rounded-3xl border border-[#FED7AA] bg-white px-6 py-7 shadow-sm">
            <p className="text-lg text-[#18181B]">Peso promedio</p>
            <h2 className="mt-2 text-5xl font-bold text-[#7C3AED]">
              {pesoPromedio} <span className="text-3xl">kg</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="w-full md:max-w-md">
              <Input
                placeholder="Buscar por mascota, raza, especie, propietario o color..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 rounded-2xl border-[#8B5CF6] bg-white text-[#7C3AED] placeholder:text-[#8B5CF6] focus-visible:ring-[#8B5CF6]"
              />
            </div>

            <div className="w-full md:max-w-xs">
              <select
                value={filtroEspecie}
                onChange={(e) => setFiltroEspecie(e.target.value)}
                className="h-14 w-full rounded-2xl border border-[#8B5CF6] bg-white px-4 text-lg text-[#7C3AED] outline-none"
              >
                {especiesDisponibles.map((especie) => (
                  <option key={especie} value={especie}>
                    {especie}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {canCreate && (
            <Button
              onClick={handleOpenCreate}
              className="h-14 rounded-2xl bg-[#F97316] px-8 text-lg font-semibold text-white hover:bg-[#EA580C]"
            >
              + Nueva mascota
            </Button>
          )}
        </div>

        <p className="text-lg text-[#18181B]">
          Mostrando {mascotasFiltradas.length} de {mascotas.length} mascotas
        </p>

        <MascotasTable
          mascotas={mascotasFiltradas}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {!loading && (
          <MascotaDialog
            open={dialogOpen}
            title={editingMascota ? "Editar Mascota" : "Nueva Mascota"}
            values={formValues}
            clientes={clientes}
            especies={especies}
            razas={razas}
            onChange={handleChange}
            onEspecieChange={(value) => {
              setFormValues((prev) => ({
                ...prev,
                id_especie: value === "" ? "" : Number(value),
                id_raza: "",
              }))
              loadRazasByEspecie(value === "" ? "" : Number(value))
            }}
            onClose={() => {
              setDialogOpen(false)
              resetForm()
            }}
            onSubmit={handleSubmit}
          />
        )}

        <MascotaDetailsDialog
          open={detailsOpen}
          mascota={detailsMascota}
          onClose={() => {
            setDetailsOpen(false)
            setDetailsMascota(null)
          }}
        />

        <DeleteMascotaConfirmation
          open={deleteOpen}
          mascota={selectedMascota}
          onClose={() => {
            setDeleteOpen(false)
            setSelectedMascota(null)
          }}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  )
}