import { api } from "@/store/api/api"
import type {
  ClinicalHistory,
  ClinicalHistoryPayload,
  ConsultaClinica,
  ConsultaClinicaPayload,
  VeterinarioOption,
  Tratamiento,
  TratamientoPayload,
  VacunaAplicada,
  VacunaAplicadaPayload,
  Receta,
  RecetaPayload,
  DetalleReceta,
  DetalleRecetaPayload,
  ProductoOption,
   ArchivoClinico,
  ArchivoClinicoPayload,
} from "./gestionarHistoriaClinica.types"

export const gestionarHistoriaClinicaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClinicalHistories: builder.query<ClinicalHistory[], void>({
      query: () => "/gestion/clinica/historiales/",
      providesTags: ["ClinicalHistory"],
      transformResponse: (
        response: ClinicalHistory[] | { results: ClinicalHistory[] }
      ) => {
        if (Array.isArray(response)) return response
        if ("results" in response && Array.isArray(response.results)) {
          return response.results
        }
        return []
      },
    }),

    getClinicalHistoryByPet: builder.query<ClinicalHistory, number>({
      query: (idMascota) => `/gestion/clinica/mascotas/${idMascota}/historial/`,
      providesTags: ["ClinicalHistory"],
    }),

    createClinicalHistory: builder.mutation<
      ClinicalHistory,
      ClinicalHistoryPayload
    >({
      query: (body) => ({
        url: "/gestion/clinica/historiales/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    updateClinicalHistory: builder.mutation<
      ClinicalHistory,
      { idHistorialClinico: number; body: Partial<ClinicalHistoryPayload> }
    >({
      query: ({ idHistorialClinico, body }) => ({
        url: `/gestion/clinica/historiales/${idHistorialClinico}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    createConsultaClinica: builder.mutation<
      ConsultaClinica,
      { idHistorialClinico: number; body: ConsultaClinicaPayload }
    >({
      query: ({ idHistorialClinico, body }) => ({
        url: `/gestion/clinica/historiales/${idHistorialClinico}/consultas/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    updateConsultaClinica: builder.mutation<
      ConsultaClinica,
      {
        idConsultaClinica: number
        body: Partial<ConsultaClinicaPayload>
      }
    >({
      query: ({ idConsultaClinica, body }) => ({
        url: `/gestion/clinica/consultas/${idConsultaClinica}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    getVeterinarios: builder.query<VeterinarioOption[], void>({
      query: () => "/gestion/clinica/veterinarios/",
      providesTags: ["ClinicalHistory"],
      transformResponse: (
        response: VeterinarioOption[] | { results: VeterinarioOption[] }
      ) => {
        if (Array.isArray(response)) return response
        if ("results" in response && Array.isArray(response.results)) {
          return response.results
        }
        return []
      },
    }),

    createTratamiento: builder.mutation<
      Tratamiento,
      { idConsultaClinica: number; body: TratamientoPayload }
    >({
      query: ({ idConsultaClinica, body }) => ({
        url: `/gestion/clinica/consultas/${idConsultaClinica}/tratamientos/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    updateTratamiento: builder.mutation<
      Tratamiento,
      { idTratamiento: number; body: Partial<TratamientoPayload> }
    >({
      query: ({ idTratamiento, body }) => ({
        url: `/gestion/clinica/tratamientos/${idTratamiento}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    createVacunaAplicada: builder.mutation<
      VacunaAplicada,
      { idConsultaClinica: number; body: VacunaAplicadaPayload }
    >({
      query: ({ idConsultaClinica, body }) => ({
        url: `/gestion/clinica/consultas/${idConsultaClinica}/vacunas/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    updateVacunaAplicada: builder.mutation<
      VacunaAplicada,
      { idVacunaAplicada: number; body: Partial<VacunaAplicadaPayload> }
    >({
      query: ({ idVacunaAplicada, body }) => ({
        url: `/gestion/clinica/vacunas/${idVacunaAplicada}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    createReceta: builder.mutation<
      Receta,
      { idConsultaClinica: number; body: RecetaPayload }
    >({
      query: ({ idConsultaClinica, body }) => ({
        url: `/gestion/clinica/consultas/${idConsultaClinica}/receta/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    updateReceta: builder.mutation<
      Receta,
      { idReceta: number; body: Partial<RecetaPayload> }
    >({
      query: ({ idReceta, body }) => ({
        url: `/gestion/clinica/recetas/${idReceta}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    createDetalleReceta: builder.mutation<
      DetalleReceta,
      { idReceta: number; body: DetalleRecetaPayload }
    >({
      query: ({ idReceta, body }) => ({
        url: `/gestion/clinica/recetas/${idReceta}/detalles/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    updateDetalleReceta: builder.mutation<
      DetalleReceta,
      { idDetalleReceta: number; body: Partial<DetalleRecetaPayload> }
    >({
      query: ({ idDetalleReceta, body }) => ({
        url: `/gestion/clinica/detalles-receta/${idDetalleReceta}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ClinicalHistory"],
    }),

    getProductosReceta: builder.query<ProductoOption[], void>({
      query: () => "/gestion/inventario/productos/",
      providesTags: ["ClinicalHistory"],
      transformResponse: (
        response: ProductoOption[] | { results: ProductoOption[] }
      ) => {
        if (Array.isArray(response)) return response
        if ("results" in response && Array.isArray(response.results)) {
          return response.results
        }
        return []
      },
    }),
    createArchivoClinico: builder.mutation<
  ArchivoClinico,
  { idConsultaClinica: number; body: ArchivoClinicoPayload }
>({
  query: ({ idConsultaClinica, body }) => {
    const formData = new FormData()
    formData.append("consulta_clinica", String(idConsultaClinica))
    formData.append("nombre_archivo", body.nombre_archivo)
    formData.append("tipo_archivo", body.tipo_archivo)
    formData.append("descripcion", body.descripcion ?? "")
    formData.append("estado", String(body.estado ?? true))

    if (body.archivo) {
      formData.append("archivo", body.archivo)
    }

    return {
      url: `/gestion/clinica/consultas/${idConsultaClinica}/archivos/`,
      method: "POST",
      body: formData,
    }
  },
  invalidatesTags: ["ClinicalHistory"],
}),

updateArchivoClinico: builder.mutation<
  ArchivoClinico,
  { idArchivoClinico: number; body: Partial<ArchivoClinicoPayload> }
>({
  query: ({ idArchivoClinico, body }) => {
    const formData = new FormData()

    if (body.consulta_clinica !== undefined && body.consulta_clinica !== null) {
      formData.append("consulta_clinica", String(body.consulta_clinica))
    }
    if (body.nombre_archivo !== undefined) {
      formData.append("nombre_archivo", body.nombre_archivo)
    }
    if (body.tipo_archivo !== undefined) {
      formData.append("tipo_archivo", body.tipo_archivo)
    }
    if (body.descripcion !== undefined) {
      formData.append("descripcion", body.descripcion ?? "")
    }
    if (body.estado !== undefined) {
      formData.append("estado", String(body.estado))
    }
    if (body.archivo) {
      formData.append("archivo", body.archivo)
    }

    return {
      url: `/gestion/clinica/archivos/${idArchivoClinico}/`,
      method: "PATCH",
      body: formData,
    }
  },
  invalidatesTags: ["ClinicalHistory"],
}),
  }),
  overrideExisting: false,
})

export const {
  useGetClinicalHistoriesQuery,
  useGetClinicalHistoryByPetQuery,
  useCreateClinicalHistoryMutation,
  useUpdateClinicalHistoryMutation,
  useCreateConsultaClinicaMutation,
  useUpdateConsultaClinicaMutation,
  useGetVeterinariosQuery,
  useCreateTratamientoMutation,
  useUpdateTratamientoMutation,
  useCreateVacunaAplicadaMutation,
  useUpdateVacunaAplicadaMutation,
  useCreateRecetaMutation,
  useUpdateRecetaMutation,
  useCreateDetalleRecetaMutation,
  useUpdateDetalleRecetaMutation,
  useGetProductosRecetaQuery,
  useCreateArchivoClinicoMutation,
  useUpdateArchivoClinicoMutation,
} = gestionarHistoriaClinicaApi