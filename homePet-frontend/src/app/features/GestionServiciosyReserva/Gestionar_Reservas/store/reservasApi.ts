import { api } from '#/store/api/api'
import type {
  MascotaOption,
  PrecioServicioOption,
  Reserva,
  ReservaEstadoPayload,
  ReservaPatchPayload,
  ServicioOption,
} from './reservas.types'

type ListResponse<T> = T[] | { results?: T[] }

function normalizeListResponse<T>(response: ListResponse<T>) {
  if (Array.isArray(response)) return response
  return response.results ?? []
}

export const reservasApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 GET RESERVAS
    getReservas: builder.query<Reserva[], void>({
      query: () => 'gestion/servicios/citas/',
      transformResponse: normalizeListResponse<Reserva>,
      providesTags: ['Appointments'],
    }),

    // 🔹 OPTIONS
    getMascotasOptions: builder.query<MascotaOption[], void>({
      query: () => 'gestion/clientes/mascotas/',
      transformResponse: normalizeListResponse<MascotaOption>,
    }),

    getServiciosOptions: builder.query<ServicioOption[], void>({
      query: () => 'gestion/servicios/',
      transformResponse: normalizeListResponse<ServicioOption>,
    }),

    getPreciosOptions: builder.query<PrecioServicioOption[], void>({
      query: () => 'gestion/servicios/precios-servicio/',
      transformResponse: normalizeListResponse<PrecioServicioOption>,
    }),

    // 🔹 CREAR RESERVA
    createReserva: builder.mutation<Reserva, ReservaPatchPayload>({
      query: (body) => ({
        url: 'gestion/servicios/citas/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),

    // 🔥 EDITAR RESERVA (PUT + limpieza automática)
    updateReserva: builder.mutation<
      Reserva,
      { id: number; body: ReservaPatchPayload }
    >({
      query: ({ id, body }) => {
        const cleanBody: any = { ...body }

        // ❌ eliminar campos que backend NO acepta
        delete cleanBody.estado
        delete cleanBody.motivo_cancelacion

        return {
          url: `gestion/servicios/citas/${id}/`,
          method: 'PUT',
          body: cleanBody,
        }
      },
      invalidatesTags: ['Appointments'],
    }),

    // 🔹 CAMBIAR ESTADO
    patchEstadoReserva: builder.mutation<
      Reserva,
      { id: number; body: ReservaEstadoPayload }
    >({
      query: ({ id, body }) => ({
        url: `gestion/servicios/citas/${id}/estado/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),

  // 🔥 evita warnings de endpoints duplicados
  overrideExisting: true,
})

export const {
  useGetMascotasOptionsQuery,
  useGetPreciosOptionsQuery,
  useGetReservasQuery,
  useGetServiciosOptionsQuery,
  usePatchEstadoReservaMutation,
  useUpdateReservaMutation,
  useCreateReservaMutation,
} = reservasApi