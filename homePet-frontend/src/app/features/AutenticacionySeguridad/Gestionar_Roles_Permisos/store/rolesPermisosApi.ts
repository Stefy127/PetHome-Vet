import { api } from '#/store/api/api'
import type {
  GrupoUsuario,
  GrupoCreatePayload,
  GrupoPermiso,
  GrupoPermisoCreatePayload,
  GrupoPermisoUpdatePayload,
  ComponenteSistema,
} from './rolesPermisos.types'

export const rolesPermisosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGrupos: builder.query<GrupoUsuario[], void>({
      query: () => '/auth/grupos/',
      providesTags: ['Grupos'],
    }),

    createGrupo: builder.mutation<GrupoUsuario, GrupoCreatePayload>({
      query: (payload) => ({
        url: '/auth/grupos/',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Grupos'],
    }),

    updateGrupo: builder.mutation<GrupoUsuario, { id: number; payload: Partial<GrupoCreatePayload> }>({
      query: ({ id, payload }) => ({
        url: `/auth/grupos/${id}/`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Grupos'],
    }),

    deleteGrupo: builder.mutation<void, number>({
      query: (id) => ({
        url: `/auth/grupos/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Grupos'],
    }),

    getComponentes: builder.query<ComponenteSistema[], void>({
      query: () => '/auth/componentes-sistema/',
      providesTags: ['Componentes'],
    }),

    getPermisosByGrupo: builder.query<GrupoPermiso[], number>({
      query: (grupoId) => `/auth/grupos-permisos/?grupo_id=${grupoId}`,
      providesTags: (_result, _error, id) => [{ type: 'Permisos', id }],
    }),

    createPermiso: builder.mutation<GrupoPermiso, GrupoPermisoCreatePayload>({
      query: (payload) => ({
        url: '/auth/grupos-permisos/',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { grupo }) => [{ type: 'Permisos', id: grupo }],
    }),

    updatePermiso: builder.mutation<GrupoPermiso, { id: number; grupo_id: number; payload: Partial<GrupoPermisoUpdatePayload> }>({
      query: ({ id, payload }) => ({
        url: `/auth/grupos-permisos/${id}/`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { grupo_id }) => [{ type: 'Permisos', id: grupo_id }],
    }),

    deletePermiso: builder.mutation<void, { id: number; grupo_id: number }>({
      query: ({ id }) => ({
        url: `/auth/grupos-permisos/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { grupo_id }) => [{ type: 'Permisos', id: grupo_id }],
    }),
  }),
})

export const {
  useGetGruposQuery,
  useCreateGrupoMutation,
  useUpdateGrupoMutation,
  useDeleteGrupoMutation,
  useGetComponentesQuery,
  useGetPermisosByGrupoQuery,
  useCreatePermisoMutation,
  useUpdatePermisoMutation,
  useDeletePermisoMutation,
} = rolesPermisosApi
