import { useState } from 'react';
import {
  UserFilters,
  UserFormModal,
  UserStats,
  UserTable,
} from '../components';
import { useGestionarUsuarios } from '../store';
import type { Usuario, UsuarioFormData } from '../store';
import { useCanCreate, useCanEdit } from '#/store/auth/auth.hooks';

export const Gestionar_Usuarios = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

  const canCreate = useCanCreate('SEG_USUARIOS');
  const canEdit = useCanEdit('SEG_USUARIOS');

  const {
    usuariosFiltrados,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    search,
    setSearch,
    rolFilter,
    setRolFilter,
    estadoFilter,
    setEstadoFilter,
    totalUsuarios,
    usuariosActivos,
    administradores,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    cambiarEstadoUsuario,
  } = useGestionarUsuarios();

  const abrirModalCrear = () => {
    setModoModal('crear');
    setUsuarioSeleccionado(null);
    setOpenModal(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setModoModal('editar');
    setUsuarioSeleccionado(usuario);
    setOpenModal(true);
  };

  const handleGuardar = async (data: UsuarioFormData) => {
    if (modoModal === 'editar' && usuarioSeleccionado) {
      editarUsuario(usuarioSeleccionado.id, data);
    } else {
      await crearUsuario(data);
    }
  };

  return (
   <section className="min-h-screen bg-white px-6 py-8 text-[#7C3AED]">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
        <h1 className="text-4xl font-bold text-[#F97316]">Gestión de Usuarios</h1>
        <p className="mt-2 text-black">
  Administra los usuarios internos del sistema de la veterinaria
</p>
        </div>

        <UserStats
          totalUsuarios={totalUsuarios}
          usuariosActivos={usuariosActivos}
          administradores={administradores}
        />

        <UserFilters
          search={search}
          setSearch={setSearch}
          rolFilter={rolFilter}
          setRolFilter={setRolFilter}
          estadoFilter={estadoFilter}
          setEstadoFilter={setEstadoFilter}
          onNuevoUsuario={abrirModalCrear}
          canCreate={canCreate}
        />

        <p className="text-sm text-zinc-400">
          Mostrando {usuariosFiltrados.length} de {totalUsuarios} usuarios
        </p>

        {isLoading && (
          <p className="text-sm text-gray-500">Cargando usuarios desde backend...</p>
        )}

        {isError && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            No se pudo cargar la lista de usuarios desde backend.
            <button
              type="button"
              onClick={() => refetch()}
              className="ml-2 font-semibold underline"
            >
              Reintentar
            </button>
            <pre className="mt-2 overflow-auto text-xs text-red-800/80">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {isFetching && !isLoading && (
          <p className="text-xs text-gray-400">Actualizando datos...</p>
        )}

        <UserTable
          usuarios={usuariosFiltrados}
          onEliminar={eliminarUsuario}
          onCambiarEstado={cambiarEstadoUsuario}
          onEditar={abrirModalEditar}
          canEdit={canEdit}
        />

        <UserFormModal
          open={openModal}
          modo={modoModal}
          usuarioInicial={usuarioSeleccionado}
          onClose={() => {
            setOpenModal(false);
            setUsuarioSeleccionado(null);
            setModoModal('crear');
          }}
          onSave={handleGuardar}
        />
      </div>
    </section>
  );
};  