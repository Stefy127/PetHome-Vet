import { api } from "@/store/api/api"
import type {
  ClienteOption,
  EspecieOption,
  Mascota,
  MascotaPayload,
  RazaOption,
} from "../types"

export const gestionarMascotasApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMascotas: builder.query<Mascota[], void>({
      query: () => "/gestion/clientes/mascotas/",
      providesTags: ["Pets"],
    }),

    getMascotasMe: builder.query<Mascota[], void>({
      query: () => "/gestion/clientes/mascotas/me/",
      transformResponse: (response: { mascotas: Mascota[] }) =>
        response.mascotas,
      providesTags: ["Pets"],
    }),

    getClientesMascota: builder.query<ClienteOption[], void>({
      query: () => "/gestion/clientes/usuarios/",
      providesTags: ["Pets"],
    }),

    getEspeciesMascota: builder.query<EspecieOption[], void>({
      query: () => "/gestion/servicios/especies/",
      providesTags: ["Especies"],
    }),

    getRazasByEspecie: builder.query<RazaOption[], number>({
      query: (idEspecie) => `/gestion/servicios/razas/?especie_id=${idEspecie}`,
      providesTags: ["Razas"],
    }),

    createMascota: builder.mutation<Mascota, MascotaPayload>({
      query: (body) => ({
        url: "/gestion/clientes/mascotas/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Pets"],
    }),

    updateMascota: builder.mutation<
      Mascota,
      { id: number; body: Partial<MascotaPayload> }
    >({
      query: ({ id, body }) => ({
        url: `/gestion/clientes/mascotas/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Pets"],
    }),

    deleteMascota: builder.mutation<void, number>({
      query: (id) => ({
        url: `/gestion/clientes/mascotas/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pets"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetMascotasQuery,
  useGetMascotasMeQuery,
  useGetClientesMascotaQuery,
  useGetEspeciesMascotaQuery,
  useLazyGetRazasByEspecieQuery,
  useCreateMascotaMutation,
  useUpdateMascotaMutation,
  useDeleteMascotaMutation,
} = gestionarMascotasApi