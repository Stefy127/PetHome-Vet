import { api } from '@/store/api/api'
import type { Reserva } from '../../Gestionar_Reservas/store/reservas.types'

export interface SlotDisponibilidad {
  inicio: string
  fin: string
}

export interface AgendaDisponibilidadResponse {
  fecha: string
  citas_ocupadas: Reserva[]
  horarios_disponibles: SlotDisponibilidad[]
  mensaje: string
}

export interface ValidarConflictoParams {
  fecha: string
  hora_inicio: string
  hora_fin: string
}

export interface ValidarConflictoResponse {
  disponible: boolean
  mensaje: string
}

export const gestionarAgendaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDisponibilidad: builder.query<AgendaDisponibilidadResponse, string>({
      query: (fecha) => `/gestion/servicios/agenda/?fecha=${fecha}`,
      providesTags: ['Appointments'],
    }),
    validarConflicto: builder.query<ValidarConflictoResponse, ValidarConflictoParams>({
      query: (params) => ({
        url: '/gestion/servicios/agenda/validar/',
        params,
      }),
    }),
  }),
})

export const {
  useGetDisponibilidadQuery,
  useLazyGetDisponibilidadQuery,
  useValidarConflictoQuery,
  useLazyValidarConflictoQuery,
} = gestionarAgendaApi
