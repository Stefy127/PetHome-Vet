'use client'

import { useState, useMemo } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Clock, Calendar, PawPrint, Briefcase, MapPin, Info } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { 
  useGetMascotasOptionsQuery, 
  useGetServiciosOptionsQuery, 
  useGetPreciosOptionsQuery,
  useCreateReservaMutation 
} from '../../Gestionar_Reservas/store/reservasApi'
import { toast } from 'sonner'

const normalizeText = (value: string | null | undefined) => {
  const normalized = (value ?? '')
    .trim()
    .toUpperCase()
    .replaceAll('Á', 'A')
    .replaceAll('É', 'E')
    .replaceAll('Í', 'I')
    .replaceAll('Ó', 'O')
    .replaceAll('Ú', 'U')
    .replaceAll('Ü', 'U')

  if (normalized.includes('DOMICILIO')) return 'DOMICILIO'
  if (normalized.includes('CONSULTA') || normalized.includes('CLINICA')) {
    return 'CLINICA'
  }

  return normalized
}

interface ReservaRapidaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fecha: string
  hora: string
}

export const ReservaRapidaModal = ({ open, onOpenChange, fecha, hora }: ReservaRapidaModalProps) => {
  const [mascotaId, setMascotaId] = useState('')
  const [servicioId, setServicioId] = useState('')
  const [precioId, setPrecioId] = useState('')
  const [modalidad, setModalidad] = useState<'CLINICA' | 'DOMICILIO'>('CLINICA')
  const [direccion, setDireccion] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const { data: mascotas = [] } = useGetMascotasOptionsQuery()
  const { data: servicios = [] } = useGetServiciosOptionsQuery()
  const { data: precios = [] } = useGetPreciosOptionsQuery()
  const [createReserva, { isLoading }] = useCreateReservaMutation()

  const serviciosActivos = useMemo(() => servicios.filter(s => s.estado), [servicios])
  
  const preciosFiltrados = useMemo(() => {
    if (!servicioId) return []
    return precios.filter(p => 
      p.estado && 
      p.servicio === Number(servicioId) && 
      normalizeText(p.modalidad) === normalizeText(modalidad)
    )
  }, [precios, servicioId, modalidad])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mascotaId || !servicioId || !precioId) {
      toast.error('Por favor completa los campos obligatorios')
      return
    }

    try {
      await createReserva({
        mascota: Number(mascotaId),
        servicio: Number(servicioId),
        precio_servicio: Number(precioId),
        fecha_programada: fecha,
        hora_inicio: hora,
        modalidad,
        direccion_cita: modalidad === 'DOMICILIO' ? direccion : null,
        descripcion
      }).unwrap()
      
      toast.success('Cita agendada correctamente')
      onOpenChange(false)
      // Reset form
      setMascotaId('')
      setServicioId('')
      setPrecioId('')
      setDireccion('')
      setDescripcion('')
    } catch (err: any) {
      const errorMsg = err?.data?.detail || 'Error al agendar la cita'
      toast.error(errorMsg)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-0 shadow-2xl animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] p-6 text-white rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div>
                <Dialog.Title className="text-xl font-bold">Reserva Rápida</Dialog.Title>
                <Dialog.Description className="text-sm text-white/80 mt-1">
                  Completa los datos para agendar la cita.
                </Dialog.Description>
              </div>
              <Dialog.Close className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Info Summary */}
            <div className="flex gap-4 p-3 rounded-2xl bg-violet-50 border border-violet-100">
              <div className="flex items-center gap-2 text-violet-700">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-semibold">{fecha}</span>
              </div>
              <div className="flex items-center gap-2 text-violet-700 border-l border-violet-200 pl-4">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-semibold">{hora}</span>
              </div>
            </div>

            {/* Mascota */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <PawPrint className="h-4 w-4 text-[#F97316]" />
                Mascota
              </label>
              <select
                value={mascotaId}
                onChange={(e) => setMascotaId(e.target.value)}
                className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition"
                required
              >
                <option value="">Selecciona una mascota</option>
                {mascotas.map(m => (
                  <option key={m.id_mascota} value={m.id_mascota}>{m.nombre}</option>
                ))}
              </select>
            </div>

            {/* Servicio y Modalidad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Briefcase className="h-4 w-4 text-[#F97316]" />
                  Servicio
                </label>
                <select
                  value={servicioId}
                  onChange={(e) => {
                    setServicioId(e.target.value)
                    setPrecioId('')
                  }}
                  className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition"
                  required
                >
                  <option value="">Servicio</option>
                  {serviciosActivos.map(s => (
                    <option key={s.id_servicio} value={s.id_servicio}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Info className="h-4 w-4 text-[#F97316]" />
                  Modalidad
                </label>
                <select
                  value={modalidad}
                  onChange={(e) => {
                    setModalidad(e.target.value as 'CLINICA' | 'DOMICILIO')
                    setPrecioId('')
                  }}
                  className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition"
                >
                  <option value="CLINICA">En Clínica</option>
                  <option value="DOMICILIO">A Domicilio</option>
                </select>
              </div>
            </div>

            {/* Variación / Precio */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Variación y Precio</label>
              <select
                value={precioId}
                onChange={(e) => setPrecioId(e.target.value)}
                disabled={!servicioId}
                className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition disabled:opacity-50"
                required
              >
                <option value="">Selecciona variación</option>
                {preciosFiltrados.map(p => (
                  <option key={p.id_precio} value={p.id_precio}>
                    {p.variacion} - Bs. {p.precio}
                  </option>
                ))}
              </select>
            </div>

            {/* Dirección (si es domicilio) */}
            {modalidad === 'DOMICILIO' && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Dirección
                </label>
                <Input
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej: Av. Bush 123"
                  className="h-11 rounded-xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
            )}

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Notas Adicionales</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full h-24 rounded-xl border-gray-200 bg-gray-50 p-4 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition resize-none"
                placeholder="Motivo de consulta..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 rounded-2xl border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-[2] h-12 rounded-2xl bg-[#F97316] text-white hover:bg-[#EA580C] shadow-lg shadow-orange-200 transition-all active:scale-95"
              >
                {isLoading ? 'Agendando...' : 'Confirmar Reserva'}
              </Button>
            </div>

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
