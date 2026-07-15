import { api } from '#/store/api/api'
import type {
  CategoriaServicio,
  CategoriaServicioPayload,
  PrecioServicio,
  PrecioServicioPayload,
  Servicio,
  ServicioPayload,
  ToggleEstadoResponse,
  Especie,
  EspeciePayload,
  Raza,
  RazaPayload,
} from './GestionarServiciosPreciosCatalogo'

export const gestionarCatalogoServiciosPreciosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategoriasServicio: builder.query<CategoriaServicio[], void>({
      query: () => ({
        url: 'gestion/servicios/categorias-servicio/',
      }),
      providesTags: ['CategoriasServicio'],
    }),

    getCategoriaServicioById: builder.query<CategoriaServicio, number>({
      query: (id) => `gestion/servicios/categorias/${id}/`,
      providesTags: (_result, _error, id) => [
        { type: 'CategoriasServicio', id },
      ],
    }),

    createCategoriaServicio: builder.mutation<
      CategoriaServicio,
      CategoriaServicioPayload
    >({
      query: (body) => ({
        url: 'gestion/servicios/categorias-servicio/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CategoriasServicio'],
    }),

    updateCategoriaServicio: builder.mutation<
      CategoriaServicio,
      { id: number; data: CategoriaServicioPayload }
    >({
      query: ({ id, data }) => ({
        url: `gestion/servicios/categorias/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'CategoriasServicio',
        { type: 'CategoriasServicio', id },
      ],
    }),

    deleteCategoriaServicio: builder.mutation<ToggleEstadoResponse, number>({
      query: (id) => ({
        url: `gestion/servicios/categorias/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CategoriasServicio', 'Servicios'],
    }),

    // =========================
    // Servicios
    // =========================
    getServicios: builder.query<Servicio[], void>({
      query: () => ({
        url: 'gestion/servicios/',
      }),
      providesTags: ['Servicios'],
    }),

    getServicioById: builder.query<Servicio, number>({
      query: (id) => `gestion/servicios/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Servicios', id }],
    }),

    createServicio: builder.mutation<Servicio, ServicioPayload>({
      query: (body) => ({
        url: 'gestion/servicios/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Servicios', 'PreciosServicio'],
    }),

    updateServicio: builder.mutation<
      Servicio,
      { id: number; data: ServicioPayload }
    >({
      query: ({ id, data }) => ({
        url: `gestion/servicios/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Servicios',
        { type: 'Servicios', id },
      ],
    }),

    deleteServicio: builder.mutation<ToggleEstadoResponse, number>({
      query: (id) => ({
        url: `gestion/servicios/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Servicios', 'PreciosServicio'],
    }),

    // =========================
    // Precios de servicio
    // =========================
    getPreciosServicio: builder.query<PrecioServicio[], void>({
      query: () => ({
        url: 'gestion/servicios/precios-servicio/',
      }),
      providesTags: ['PreciosServicio'],
    }),

    getPrecioServicioById: builder.query<PrecioServicio, number>({
      query: (id) => `gestion/servicios/precios-servicio/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'PreciosServicio', id }],
    }),

    createPrecioServicio: builder.mutation<
      PrecioServicio,
      PrecioServicioPayload
    >({
      query: (body) => ({
        url: 'gestion/servicios/precios-servicio/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PreciosServicio'],
    }),

    updatePrecioServicio: builder.mutation<
      PrecioServicio,
      { id: number; data: PrecioServicioPayload }
    >({
      query: ({ id, data }) => ({
        url: `gestion/servicios/precios-servicio/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'PreciosServicio',
        { type: 'PreciosServicio', id },
      ],
    }),

    deletePrecioServicio: builder.mutation<ToggleEstadoResponse, number>({
      query: (id) => ({
        url: `gestion/servicios/precios-servicio/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PreciosServicio'],
    }),

    // =========================
    // Especies
    // =========================
    getEspecies: builder.query<Especie[], void>({
      query: () => ({
        url: 'gestion/servicios/especies/',
      }),
      providesTags: ['Especies'],
    }),

    createEspecie: builder.mutation<Especie, EspeciePayload>({
      query: (body) => ({
        url: 'gestion/servicios/especies/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Especies'],
    }),

    updateEspecie: builder.mutation<Especie, { id: number; data: EspeciePayload }>({
      query: ({ id, data }) => ({
        url: `gestion/servicios/especies/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Especies'],
    }),

    deleteEspecie: builder.mutation<void, number>({
      query: (id) => ({
        url: `gestion/servicios/especies/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Especies', 'Razas'],
    }),

    // =========================
    // Razas
    // =========================
    getRazas: builder.query<Raza[], { especie_id?: number } | void>({
      query: (params) => ({
        url: 'gestion/servicios/razas/',
        params: params || undefined,
      }),
      providesTags: ['Razas'],
    }),

    createRaza: builder.mutation<Raza, RazaPayload>({
      query: (body) => ({
        url: 'gestion/servicios/razas/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Razas'],
    }),

    updateRaza: builder.mutation<Raza, { id: number; data: RazaPayload }>({
      query: ({ id, data }) => ({
        url: `gestion/servicios/razas/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Razas'],
    }),

    deleteRaza: builder.mutation<void, number>({
      query: (id) => ({
        url: `gestion/servicios/razas/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Razas'],
    }),
  }),
})

export const {
  useGetCategoriasServicioQuery,
  useLazyGetCategoriasServicioQuery,
  useGetCategoriaServicioByIdQuery,
  useCreateCategoriaServicioMutation,
  useUpdateCategoriaServicioMutation,
  useDeleteCategoriaServicioMutation,

  useGetServiciosQuery,
  useLazyGetServiciosQuery,
  useGetServicioByIdQuery,
  useCreateServicioMutation,
  useUpdateServicioMutation,
  useDeleteServicioMutation,

  useGetPreciosServicioQuery,
  useLazyGetPreciosServicioQuery,
  useGetPrecioServicioByIdQuery,
  useCreatePrecioServicioMutation,
  useUpdatePrecioServicioMutation,
  useDeletePrecioServicioMutation,

  useGetEspeciesQuery,
  useCreateEspecieMutation,
  useUpdateEspecieMutation,
  useDeleteEspecieMutation,

  useGetRazasQuery,
  useCreateRazaMutation,
  useUpdateRazaMutation,
  useDeleteRazaMutation,
} = gestionarCatalogoServiciosPreciosApi
