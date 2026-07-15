import { api } from '#/store/api/api'
import type {
  Cliente,
  ClienteCreatePayload,
  ClienteUpdatePayload,
  ClientesQueryParams,
  PaginatedClientesResponse,
} from './gestionarClientes.types'

export const clientesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener lista de clientes con paginación y filtros (Admin)
    getClientes: builder.query<
      PaginatedClientesResponse,
      ClientesQueryParams | void
    >({
      query: (params) => ({
        url: 'gestion/clientes/clientes/',
        params: params || {},
      }),
      providesTags: ['Clients'],
    }),

    // Obtener un cliente específico (Admin)
    getClienteById: builder.query<Cliente, number>({
      query: (id) => `gestion/clientes/clientes/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Clients', id }],
    }),

    // Crear cliente por administrador
    createCliente: builder.mutation<Cliente, ClienteCreatePayload>({
      query: (body) => ({
        url: 'gestion/clientes/clientes/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Clients'],
    }),

    // Registro público de cliente
    registerClientePublic: builder.mutation<Cliente, ClienteCreatePayload>({
      query: (body) => ({
        url: 'gestion/clientes/register/',
        method: 'POST',
        body,
      }),
      // Puede o no invalidar 'Cliente' dependiendo si un admin está viendo la tabla al mismo tiempo
      invalidatesTags: ['Clients'],
    }),

    // Actualizar datos de un cliente (Admin)
    updateCliente: builder.mutation<
      Cliente,
      { id: number; data: ClienteUpdatePayload }
    >({
      query: ({ id, data }) => ({
        url: `gestion/clientes/clientes/${id}/`,
        method: 'PATCH', // PATCH para actualizaciones parciales
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Clients',
        { type: 'Clients', id },
      ],
    }),

    // Eliminar (borrado lógico o físico dependiendo del backend, en este caso el modelo muestra delete())
    deleteCliente: builder.mutation<void, number>({
      query: (id) => ({
        url: `gestion/clientes/clientes/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Clients'],
    }),
  }),
})

export const {
  useGetClientesQuery,
  useLazyGetClientesQuery,
  useGetClienteByIdQuery,
  useCreateClienteMutation,
  useRegisterClientePublicMutation,
  useUpdateClienteMutation,
  useDeleteClienteMutation,
} = clientesApi
