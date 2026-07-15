import { api } from '#/store/api/api'

import type { Usuario, UserRole, UserStatus } from './gestionarUsuarios.types'
import type { BackendUsuario, PaginatedResponse } from '../types'


type UsersResponse<T> = PaginatedResponse<T> | T[]

const normalizeRole = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim()

const mapRole = (
  role: BackendUsuario['rol'] | BackendUsuario['role']
): UserRole => {
  const raw = typeof role === 'string' ? role : role?.nombre ?? ''
  const normalized = normalizeRole(raw)

  if (normalized.includes('ADMIN')) return 'Administrador'
  if (normalized.includes('VETERINARIAN')) return 'Veterinario'
  if (normalized.includes('RECEPTION') || normalized.includes('RECEPCION')) {
    return 'Recepcionista'
  }
  if (normalized.includes('CLIENT')) return 'Cliente'

  // Evita perder filas por variaciones de contrato en backend.
  return 'Cliente'
}

const mapStatus = (
  isActive: BackendUsuario['is_active'],
  estado: BackendUsuario['estado']
): UserStatus => {
  if (typeof isActive === 'boolean') {
    return isActive ? 'Activo' : 'Inactivo'
  }

  if (typeof estado === 'boolean') {
    return estado ? 'Activo' : 'Inactivo'
  }

  const normalized = String(estado ?? '')
    .toLowerCase()
    .trim()

  return normalized === 'activo' || normalized === 'active'
    ? 'Activo'
    : 'Inactivo'
}

const mapBackendUsuario = (usuario: BackendUsuario): Usuario => {
  const authUser =
    typeof usuario.usuario === 'number' ? undefined : usuario.usuario
  const rawUsuarioId =
    typeof usuario.usuario === 'number' ? usuario.usuario : authUser?.id_usuario
  const role = mapRole(
    usuario.rol ?? usuario.role ?? authUser?.rol ?? authUser?.role
  )

  const userId = usuario.id_usuario ?? rawUsuarioId ?? authUser?.id ?? usuario.id ?? 0
  const displayId = userId || usuario.id_perfil || 0

  return {
    id: displayId,
    id_usuario: userId || undefined,
    id_veterinaria: usuario.id_veterinaria ?? authUser?.id_veterinaria ?? null,
    nombre: usuario.nombre ?? usuario.perfil?.nombre ?? 'Sin nombre',
    correo: usuario.correo ?? authUser?.correo ?? '',
    telefono: usuario.telefono ?? usuario.perfil?.telefono ?? '-',
    direccion: usuario.direccion ?? usuario.perfil?.direccion ?? 'Sin asignar',
    rol: role,
    estado: mapStatus(usuario.is_active ?? authUser?.is_active, usuario.estado),
    creadoEn:
      (
        usuario.date_joined ??
        authUser?.date_joined ??
        usuario.fecha_creacion ??
        usuario.creado_en ??
        usuario.created_at ??
        ''
      ).split('T')[0] ||
      '-',
  }
}

const getUsersFromResponse = (response: UsersResponse<BackendUsuario>) => {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response.results)) {
    return response.results
  }

  if (Array.isArray(response.data)) {
    return response.data
  }

  return []
}

const toUsuarios = (response: UsersResponse<BackendUsuario>) =>
  getUsersFromResponse(response).map(mapBackendUsuario)

const normalizeNextUrl = (next: string) => {
  try {
    const parsed = new URL(next)
    return `${parsed.pathname}${parsed.search}`.replace(/^\/api\//, '/')
  } catch {
    return next.replace(/^\/api\//, '/')
  }
}

export const gestionarUsuariosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsuarios: builder.query<Usuario[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const usersResponse = await baseQuery({ url: 'auth/usuarios/' })

        if (!usersResponse.error) {
          const firstPage =
            usersResponse.data as UsersResponse<BackendUsuario>

          if (Array.isArray(firstPage)) {
            return {
              data: toUsuarios(firstPage),
            }
          }

          const collectedUsers = [...getUsersFromResponse(firstPage)]
          let nextPage = firstPage.next ?? null
          let pagesFetched = 0

          while (nextPage && pagesFetched < 50) {
            const nextResponse = await baseQuery({
              url: normalizeNextUrl(nextPage),
            })

            if (nextResponse.error) {
              break
            }

            const nextData = nextResponse.data as UsersResponse<BackendUsuario>

            if (Array.isArray(nextData)) {
              collectedUsers.push(...nextData)
              break
            }

            collectedUsers.push(...getUsersFromResponse(nextData))
            nextPage = nextData.next ?? null
            pagesFetched += 1
          }

          return {
            data: collectedUsers.map(mapBackendUsuario),
          }
        }

        const status = (usersResponse.error as { status?: number | string }).status

        if (status === 404 || status === 'PARSING_ERROR') {
          const perfilesResponse = await baseQuery({ url: 'auth/perfiles/' })

          if (perfilesResponse.error) {
            return { error: perfilesResponse.error }
          }

          return {
            data: toUsuarios(
              perfilesResponse.data as
              | UsersResponse<BackendUsuario>
              | BackendUsuario[]
            ),
          }
        }

        return { error: usersResponse.error }
      },
      providesTags: ['User'],
    }),
    createUsuario: builder.mutation<Usuario, Partial<import('./gestionarUsuarios.types').UsuarioFormData>>({
      query: (body) => ({
        url: 'auth/usuarios/',
        method: 'POST',
        body: {
          correo: body.correo,
          password: body.correo, // default password
          id_rol: body.rol === 'Administrador' ? 1 : body.rol === 'Veterinario' ? 2 : body.rol === 'Cliente' ? 3 : body.rol === 'Recepcionista' ? 4 : 1,
          nombre: body.nombre,
          telefono: body.telefono,
          direccion: body.direccion,
          estado: body.estado === 'Activo',
          is_active: body.estado === 'Activo',
        },
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetUsuariosQuery, useCreateUsuarioMutation } = gestionarUsuariosApi
