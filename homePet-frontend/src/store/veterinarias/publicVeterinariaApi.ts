import { api } from "../api/api";
import type { VeterinariaPublica } from "../tenant/tenant.types";

export const publicVeterinariaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublicVeterinarias: builder.query<VeterinariaPublica[], string | void>({
      query: (search) => ({
        url: `/public/veterinarias/${search ? `?search=${encodeURIComponent(search)}` : ""}`,
        method: "GET",
      }),
      providesTags: ["Veterinarias"],
    }),
    getPublicVeterinariaBySlug: builder.query<VeterinariaPublica, string>({
      query: (slug) => `/public/veterinarias/${slug}/`,
      providesTags: (_result, _error, slug) => [{ type: "Veterinarias", id: slug }],
    }),
  }),
});

export const {
  useGetPublicVeterinariasQuery,
  useLazyGetPublicVeterinariasQuery,
  useGetPublicVeterinariaBySlugQuery,
} = publicVeterinariaApi;
