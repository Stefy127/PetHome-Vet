import type { ColumnDef } from '@tanstack/react-table'
import type { Cliente } from '../store'
import { Mail, Phone, MapPin, MoreHorizontal, Pencil, Power, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'

// Helper para iniciales
const getInitials = (nombre: string) => {
  return nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Helper para fechas
const formatDate = (dateString: string) => {
  const months = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
  ]
  const [year, month, day] = dateString.split('T')[0]?.split('-') || dateString.split('-')
  if (!year || !month || !day) return dateString
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`
}

function AccionesCell({ 
  cliente,
  onEdit,
  onDelete,
  onToggleStatus 
}: { 
  cliente: Cliente
  onEdit: (cliente: Cliente) => void
  onDelete: (clienteId: number) => void
  onToggleStatus: (clienteId: number) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  return (
    <div className="relative inline-block text-right" ref={menuRef}>
      <Button 
        variant="ghost" 
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0 text-[#F97316] hover:bg-[#F97316]/10 hover:text-[#F97316]"
      >
        <span className="sr-only">Abrir menú</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-[#F97316]/30 bg-white shadow-2xl">
          <button
            type="button"
            onClick={() => {
              onEdit(cliente)
              setIsOpen(false)
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-black hover:bg-[#F97316]/10"
          >
            <Pencil className="h-4 w-4" />
            <span>Editar cliente</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              onToggleStatus(cliente.id_perfil)
              setIsOpen(false)
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-black hover:bg-[#F97316]/10"
          >
            <Power className="h-4 w-4" />
            <span>{cliente.estado === true ? 'Desactivar' : 'Activar'}</span>
          </button>

          <div className="h-px bg-gray-200" />

          <button
            type="button"
            onClick={() => {
              onDelete(cliente.id_perfil)
              setIsOpen(false)
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            <span>Eliminar cliente</span>
          </button>
        </div>
      )}
    </div>
  )
}


interface ClientesColumnsProps {
  onEdit: (cliente: Cliente) => void
  onDelete: (clienteId: number) => void
  onToggleStatus: (clienteId: number) => void
  canEdit?: boolean
}

export const getClientesColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  canEdit = true,
}: ClientesColumnsProps): ColumnDef<Cliente>[] => [
  {
    accessorKey: 'nombre',
    header: 'Cliente',
    cell: ({ row }) => {
      const cliente = row.original
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F97316]/30 bg-[#7C3AED]/10 text-sm font-semibold text-[#7C3AED]">
            {getInitials(cliente.nombre)}
          </div>
          <div>
            <p className="font-medium text-black">{cliente.nombre}</p>
            <p className="text-sm text-gray-600">ID: {cliente.usuario}</p>
          </div>
        </div>
      )
    },
  },
  {
    id: 'contacto',
    header: 'Contacto',
    cell: ({ row }) => {
      const cliente = row.original
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-black">
            <Mail className="h-3.5 w-3.5 text-gray-500" />
            {cliente.correo}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone className="h-3.5 w-3.5" />
            {cliente.telefono}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'direccion',
    header: 'Ubicación / Dirección',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-black">
          <MapPin className="h-4 w-4 text-gray-500" />
          {row.original.direccion}
        </div>
      )
    },
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const activo = row.original.estado === true
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            activo
              ? 'border border-green-300 bg-green-50 text-green-700'
              : 'border border-red-300 bg-red-50 text-red-700'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              activo ? 'bg-green-600' : 'bg-red-600'
            }`}
          />
          {activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  },
  {
    accessorKey: 'fecha_creacion',
    header: 'Registro',
    cell: ({ row }) => {
      return <span className="text-gray-700">{formatDate(row.original.fecha_creacion)}</span>
    },
  },
  ...(canEdit
    ? [
        {
          id: 'acciones',
          header: () => <div className="text-right">Acciones</div>,
          cell: ({ row }: any) => {
            return (
              <div className="text-right">
                <AccionesCell
                  cliente={row.original}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                />
              </div>
            )
          },
        } as ColumnDef<Cliente>,
      ]
    : []),
]
