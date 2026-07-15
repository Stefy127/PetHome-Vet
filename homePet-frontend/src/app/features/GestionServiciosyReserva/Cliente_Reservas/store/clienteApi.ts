import { api } from '#/store/api/api'
import type {
  Cita,
  CitaPayload,
  Especie,
  Mascota,
  MascotaPayload,
  PrecioServicio,
  Raza,
  Servicio,
} from './cliente.types'

type ListResponse<T> = T[] | { results?: T[] }

function normalizeListResponse<T>(response: ListResponse<T>) {
  if (Array.isArray(response)) return response
  return response.results ?? []
}

export const clienteApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMisMascotas: builder.query<Mascota[], void>({
      query: () => '/gestion/clientes/mascotas/',
      transformResponse: normalizeListResponse<Mascota>,
      providesTags: ['Pets'],
    }),
    createMiMascota: builder.mutation<Mascota, MascotaPayload>({
      query: (body) => ({
        url: '/gestion/clientes/mascotas/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Pets'],
    }),
    getEspecies: builder.query<Especie[], void>({
      query: () => '/gestion/clientes/especies/',
      transformResponse: normalizeListResponse<Especie>,
    }),
    getRazas: builder.query<Raza[], number | undefined>({
      query: (especie) => ({
        url: '/gestion/clientes/razas/',
        params: especie ? { especie_id: especie } : undefined,
      }),
      transformResponse: normalizeListResponse<Raza>,
    }),
    getServicios: builder.query<Servicio[], void>({
      query: () => '/gestion/servicios/',
      transformResponse: normalizeListResponse<Servicio>,
    }),
    getPreciosServicio: builder.query<PrecioServicio[], void>({
      query: () => '/gestion/servicios/precios-servicio/',
      transformResponse: normalizeListResponse<PrecioServicio>,
    }),
    getMisCitas: builder.query<Cita[], void>({
      query: () => '/gestion/servicios/citas/',
      transformResponse: normalizeListResponse<Cita>,
      providesTags: ['Appointments'],
    }),
    createCita: builder.mutation<Cita, CitaPayload>({
      query: (body) => ({
        url: '/gestion/servicios/citas/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
    updateCita: builder.mutation<Cita, { id: number; body: Partial<CitaPayload> }>({
      query: ({ id, body }) => ({
        url: `/gestion/servicios/citas/${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
    cancelCita: builder.mutation<Cita, { id: number; motivo_cancelacion: string }>({
      query: ({ id, motivo_cancelacion }) => ({
        url: `/gestion/servicios/citas/${id}/estado/`,
        method: 'PATCH',
        body: {
          estado: 'CANCELADA',
          motivo_cancelacion,
        },
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCancelCitaMutation,
  useCreateCitaMutation,
  useCreateMiMascotaMutation,
  useGetEspeciesQuery,
  useGetMisCitasQuery,
  useGetMisMascotasQuery,
  useGetPreciosServicioQuery,
  useGetRazasQuery,
  useGetServiciosQuery,
  useUpdateCitaMutation,
} = clienteApi
