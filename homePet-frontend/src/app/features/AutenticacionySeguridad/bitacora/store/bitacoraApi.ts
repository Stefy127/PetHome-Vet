import { api } from '#/store/api/api'; // Ajusta la ruta a donde exportas tu 'api' base
import type { Bitacora, PaginatedResponse, BitacoraFilters } from './bitacora.types';

export const bitacoraApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBitacoras: builder.query<PaginatedResponse<Bitacora>, BitacoraFilters>({
      query: (params) => ({
        url: 'auth/bitacora/',
        params,
      }),
      // Opcional: proveer tags si en algún momento quieres invalidar caché
      providesTags: ['Bitacora'] as any, 
    }),
  }),
  overrideExisting: false,
});

export const { useGetBitacorasQuery } = bitacoraApi;