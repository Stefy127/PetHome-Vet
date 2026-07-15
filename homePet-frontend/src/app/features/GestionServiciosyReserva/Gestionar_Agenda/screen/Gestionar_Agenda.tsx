'use client'

import { useState } from 'react'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'
import { es } from 'date-fns/locale'

import { Button } from '#/components/ui/button'
import { useGetDisponibilidadQuery } from '../store/gestionarAgendaApi'
import { ReservaRapidaModal } from '../components/ReservaRapidaModal'

export const Gestionar_Agenda = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  
  const formattedDate = format(selectedDate, 'yyyy-MM-dd')
  
  const { data, isLoading } = useGetDisponibilidadQuery(formattedDate)

  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1))
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1))
  const handleToday = () => setSelectedDate(new Date())

  const occupiedCount = data?.citas_ocupadas?.length || 0
  const freeCount = data?.horarios_disponibles?.length || 0

  return (
    <section className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-full bg-[#7C3AED]/10 p-2">
                <CalendarIcon className="h-6 w-6 text-[#7C3AED]" />
              </div>
              <h1 className="text-3xl font-bold text-[#F97316] sm:text-4xl">
                Agenda y Disponibilidad
              </h1>
            </div>
            <p className="text-gray-600">
              Visualiza las citas agendadas y los horarios disponibles para tu veterinaria.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleToday}
              className="rounded-xl border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5"
            >
              Hoy
            </Button>
            <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1">
              <button 
                onClick={handlePrevDay}
                className="rounded-lg p-2 hover:bg-gray-100 transition"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="px-4 py-1 text-sm font-semibold text-gray-900 min-w-[140px] text-center">
                {format(selectedDate, 'eeee, d MMMM', { locale: es })}
              </div>
              <button 
                onClick={handleNextDay}
                className="rounded-lg p-2 hover:bg-gray-100 transition"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#7C3AED]/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Horarios Disponibles</p>
                <p className="text-3xl font-bold text-[#7C3AED]">{freeCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#F97316]/10 p-2">
                <Clock className="h-5 w-5 text-[#F97316]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Citas Ocupadas</p>
                <p className="text-3xl font-bold text-[#F97316]">{occupiedCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado del Día</p>
                <p className="text-xl font-bold text-blue-700">
                  {freeCount > 0 ? 'Con Disponibilidad' : 'Agenda Llena'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column: Appointments List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Citas Programadas</h2>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent" />
                </div>
              ) : occupiedCount === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 py-16 text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-300" />
                  <p className="mt-4 font-medium text-gray-500">No hay citas para este día.</p>
                </div>
              ) : (
                data?.citas_ocupadas.map((cita) => (
                  <div 
                    key={cita.id_cita}
                    className="group relative flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-[#7C3AED]/30 hover:shadow-md sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4 sm:flex-1">
                      <div className="flex flex-col items-center rounded-xl bg-[#F97316]/5 p-3 text-[#F97316]">
                        <span className="text-sm font-bold">{(cita.hora_inicio || '').slice(0, 5)}</span>
                        <span className="text-[10px] uppercase font-medium">Inicio</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{cita.servicio_nombre}</h4>
                        <p className="text-sm text-gray-500">
                          Mascota: <span className="font-medium text-gray-700">{cita.mascota_nombre}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:gap-6">
                      <div className="text-right">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          cita.estado === 'CONFIRMADA' ? 'bg-green-100 text-green-700' : 
                          cita.estado === 'PENDIENTE' ? 'bg-amber-100 text-amber-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {cita.estado}
                        </span>
                        <p className="mt-1 text-xs text-gray-400">ID #{cita.id_cita}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Free Slots */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Espacios Libres</h2>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {isLoading ? (
                <div className="col-span-full h-24 animate-pulse rounded-2xl bg-gray-50" />
              ) : freeCount === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center rounded-3xl bg-gray-50 py-10 text-center">
                  <XCircle className="h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Sin disponibilidad</p>
                </div>
              ) : (
                data?.horarios_disponibles.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedSlot(slot.inicio)
                      setIsModalOpen(true)
                    }}
                    className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white py-4 transition hover:border-[#7C3AED] hover:bg-[#7C3AED]/5 hover:text-[#7C3AED]"
                  >
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-bold">{slot.inicio}</span>
                  </button>
                ))
              )}
            </div>

            {/* Legend/Info */}
            <div className="rounded-2xl bg-[#7C3AED]/5 p-5">
              <h5 className="font-semibold text-[#7C3AED]">Información de Agenda</h5>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#7C3AED]" />
                  Los turnos son de 30 minutos.
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#F97316]" />
                  Horario de atención: 08:00 - 18:00.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      <ReservaRapidaModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        fecha={formattedDate}
        hora={selectedSlot || ''}
      />
    </section>
  )
}
