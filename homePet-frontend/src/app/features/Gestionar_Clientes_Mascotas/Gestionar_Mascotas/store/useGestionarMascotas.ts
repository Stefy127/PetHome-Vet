import { useEffect, useState } from "react"
import type { MascotaPayload } from "../types"
import {
  useCreateMascotaMutation,
  useDeleteMascotaMutation,
  useGetClientesMascotaQuery,
  useGetEspeciesMascotaQuery,
  useGetMascotasQuery,
  useLazyGetRazasByEspecieQuery,
  useUpdateMascotaMutation,
} from "./gestionarMascotasApi"

export function useGestionarMascotas() {
  const {
    data: mascotas = [],
    isLoading: loading,
    refetch: reloadMascotas,
    error: mascotasError,
  } = useGetMascotasQuery()

  const {
    data: clientes = [],
    isLoading: clientesLoading,
    error: clientesError,
  } = useGetClientesMascotaQuery()

  const {
    data: especies = [],
    isLoading: especiesLoading,
    error: especiesError,
  } = useGetEspeciesMascotaQuery()

  const [triggerRazas, { data: razasData, isLoading: razasLoading }] =
    useLazyGetRazasByEspecieQuery()

  const [razas, setRazas] = useState(razasData || [])

  const [createMascotaMutation] = useCreateMascotaMutation()
  const [updateMascotaMutation] = useUpdateMascotaMutation()
  const [deleteMascotaMutation] = useDeleteMascotaMutation()

  useEffect(() => {
    if (razasData) {
      setRazas(razasData)
    }
  }, [razasData])

  useEffect(() => {
    if (mascotasError) {
      console.error("Error cargando mascotas:", mascotasError)
    }
  }, [mascotasError])

  useEffect(() => {
    if (clientesError) {
      console.error("Error cargando clientes:", clientesError)
    }
  }, [clientesError])

  useEffect(() => {
    if (especiesError) {
      console.error("Error cargando especies:", especiesError)
    }
  }, [especiesError])

  const loadRazasByEspecie = async (idEspecie: number | "") => {
    if (!idEspecie) {
      setRazas([])
      return
    }

    try {
      const result = await triggerRazas(idEspecie).unwrap()
      setRazas(result)
    } catch (error) {
      console.error("Error cargando razas:", error)
      setRazas([])
    }
  }

  const createMascota = async (payload: MascotaPayload) => {
    return await createMascotaMutation(payload).unwrap()
  }

  const updateMascota = async (
    id: number,
    payload: Partial<MascotaPayload>,
  ) => {
    return await updateMascotaMutation({ id, body: payload }).unwrap()
  }

  const deleteMascota = async (id: number) => {
    return await deleteMascotaMutation(id).unwrap()
  }

  return {
    mascotas,
    clientes,
    especies,
    razas,
    loading,
    catalogLoading: clientesLoading || especiesLoading || razasLoading,
    loadRazasByEspecie,
    createMascota,
    updateMascota,
    deleteMascota,
    reloadMascotas,
  }
}