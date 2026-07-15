import { api } from '#/store/api/api'
import type {
  Venta,
  VentaCreatePayload,
  VentaListFilters,
  VentaListResponse,
} from '../types/ventas.types'

export const ventasApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createVenta: builder.mutation<Venta, VentaCreatePayload>({
      query: (body) => ({
        url: '/gestion/ventas-pagos/ventas/',
        method: 'POST',
        body,
      }),
    }),
    getVentas: builder.query<VentaListResponse, VentaListFilters | void>({
      query: (params) => ({
        url: '/gestion/ventas-pagos/ventas/',
        params,
      }),
    }),
    getVentaById: builder.query<Venta, number>({
      query: (id) => ({
        url: `/gestion/ventas-pagos/ventas/${id}/`,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useCreateVentaMutation, useGetVentasQuery, useGetVentaByIdQuery } = ventasApi
