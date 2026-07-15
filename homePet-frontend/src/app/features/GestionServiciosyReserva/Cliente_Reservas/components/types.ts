import type { FormEvent } from 'react'
import type {
  Cita,
  Mascota,
  ModalidadCita,
  PrecioServicio,
  Servicio,
} from '../store/cliente.types'

export type Coordinates = {
  lat: number
  lng: number
}

export type ReservaFormState = {
  mascota: string
  servicio: string
  precio_servicio: string
  fecha_programada: string
  hora_inicio: string
  modalidad: ModalidadCita
  direccion_cita: string
  descripcion: string
}

export type ReservaFormProps = {
  availablePrecios: PrecioServicio[]
  citas?: Cita[]
  canSubmit: boolean
  creating: boolean
  dateTimeIsFuture: boolean
  editingId: number | null
  form: ReservaFormState
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  isFormOpen: boolean
  isGettingLocation: boolean
  loadingCatalogs: boolean
  loadingMascotas: boolean
  loadingServicios: boolean
  mapCoords: Coordinates | null
  mascotas: Mascota[]
  mascotasError: boolean
  message: string | null
  onCancel: () => void
  onGetLocation: () => void
  openChange: (open: boolean) => void
  preciosError: boolean
  servicios: Servicio[]
  serviciosError: boolean
  updateField: (field: keyof ReservaFormState, value: string) => void
  updating: boolean
}

export type ReservasListProps = {
  cancelId: number | null
  cancelReason: string
  canceling: boolean
  citas: Cita[]
  citasError: boolean
  loadingCitas: boolean
  onCancelReasonChange: (value: string) => void
  onCloseCancel: () => void
  onConfirmCancel: () => void
  onOpenCancel: (id: number) => void
  onStartEdit: (cita: Cita) => void
}

