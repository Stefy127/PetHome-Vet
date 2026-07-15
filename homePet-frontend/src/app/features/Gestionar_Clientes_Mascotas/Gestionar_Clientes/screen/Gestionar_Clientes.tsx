'use client'

import { useMemo, useState } from 'react'
import {
  useGetClientesQuery,
  useCreateClienteMutation,
  useUpdateClienteMutation,
  useDeleteClienteMutation,
} from '../store'
import type { Cliente, ClienteCreatePayload } from '../store/gestionarClientes.types'
import { ClientesTable, ClienteDialog, DeleteClienteConfirmation } from '../components'
import { Plus, Search, Filter, Users, PawPrint, MapPin } from 'lucide-react'
import { useCanCreate, useCanEdit } from '#/store/auth/auth.hooks'

export const GestionarClientes = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'inactivo'>('all')
  const [locationFilter, setLocationFilter] = useState('')

  const canCreate = useCanCreate('CLI_CLIENTES')
  const canEdit = useCanEdit('CLI_CLIENTES')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<number | null>(null)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const {
    data: paginatedData,
    isLoading: isLoadingClientes,
  } = useGetClientesQuery({
    search: searchQuery,
    estado: statusFilter !== 'all' ? (statusFilter === 'activo' ? true : false) : undefined,
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
  })

  const [createCliente, { isLoading: isCreating }] = useCreateClienteMutation()
  const [updateCliente, { isLoading: isUpdating }] = useUpdateClienteMutation()
  const [deleteCliente] = useDeleteClienteMutation()

  const clientes = paginatedData?.results || []

  const stats = useMemo(() => {
    const total = paginatedData?.count || 0
    const activos = clientes.filter((c) => c.estado === true).length
    const ciudades = new Set(clientes.map((c) => c.direccion)).size
    return { total, activos, ciudades }
  }, [clientes, paginatedData])

  const handleCreateCliente = () => {
    setEditingCliente(undefined)
    setIsDialogOpen(true)
  }

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (data: ClienteCreatePayload) => {
    try {
      if (editingCliente) {
        // En update parcial normalmente no se manda el password.
        const payload: any = { ...data };
        delete payload.password;
        await updateCliente({ id: editingCliente.id_perfil, data: payload }).unwrap()
      } else {
        await createCliente(data).unwrap()
      }
      setIsDialogOpen(false)
      setEditingCliente(undefined)
    } catch (err) {
      console.error('Failed to save the client: ', err)
      throw err // Para que el form capte el error si es necesario
    }
  }

  const handleDeleteClick = (clienteId: number) => {
    setClienteToDelete(clienteId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (clienteToDelete) {
      try {
        await deleteCliente(clienteToDelete).unwrap()
        setDeleteDialogOpen(false)
        setClienteToDelete(null)
      } catch (err) {
        console.error('Failed to delete the client: ', err)
      }
    }
  }

  const handleToggleStatus = async (clienteId: number) => {
    try {
        // Nota: en el backend original estado es read_only en PerfilSerializer, 
        // pero mandaremos el update. Quizas necesite backend update para esto.
      const cliente = clientes.find((c) => c.id_perfil === clienteId);
      if (cliente) {
          await updateCliente({ id: clienteId, data: { ...cliente, estado: !cliente.estado } as any }).unwrap()
      }
    } catch (err) {
      console.error('Failed to toggle client status: ', err)
    }
  }

  const isLoading = isCreating || isUpdating || isLoadingClientes

  return (
    <section className="min-h-screen bg-white px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-full bg-[#7C3AED]/10 p-2">
              <PawPrint className="h-6 w-6 text-[#7C3AED]" />
            </div>
            <h1 className="text-4xl font-bold text-[#F97316]">
              Gestionar Clientes
            </h1>
          </div>

          <p className="mt-2 text-black">
            Administra los clientes de la veterinaria
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#7C3AED]/10 p-2">
                <Users className="h-5 w-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total clientes</p>
                <p className="text-3xl font-bold text-[#7C3AED]">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#F97316]/10 p-2">
                <PawPrint className="h-5 w-5 text-[#F97316]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clientes activos</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-[#F97316]">
                    {stats.activos}
                  </p>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F97316]" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#7C3AED]/10 p-2">
                <MapPin className="h-5 w-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ubicaciones</p>
                <p className="text-3xl font-bold text-[#7C3AED]">
                  {stats.ciudades}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C3AED]/70" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#7C3AED] bg-white px-4 pl-9 text-black outline-none placeholder:text-gray-500"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C3AED]/70" />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as 'all' | 'activo' | 'inactivo',
                    )
                  }
                  className="h-11 rounded-xl border border-[#7C3AED] bg-white px-4 pl-9 pr-8 text-black outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>
              </div>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C3AED]/70" />
                <input
                  type="text"
                  placeholder="Ubicación o dirección..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="h-11 rounded-xl border border-[#7C3AED] bg-white px-4 pl-9 pr-4 text-black outline-none placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {canCreate && (
            <button
              type="button"
              onClick={handleCreateCliente}
              className="inline-flex h-11 items-center rounded-xl bg-[#F97316] px-5 font-medium text-white transition hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo cliente
            </button>
          )}
        </div>

        <p className="text-sm text-black">
          Mostrando {clientes.length} de {stats.total} clientes
        </p>

        <ClientesTable
          clientes={clientes}
          onEdit={handleEditCliente}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
          pageCount={Math.ceil((paginatedData?.count || 0) / pagination.pageSize)}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          onPaginationChange={setPagination}
          canEdit={canEdit}
        />

        <ClienteDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) setEditingCliente(undefined)
          }}
          cliente={editingCliente}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <DeleteClienteConfirmation
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </section>
  )
}
