import { useEffect, useRef, useState } from 'react';
import type { Usuario } from '../store';

interface UserTableProps {
  usuarios: Usuario[];
  onEliminar: (id: number) => void;
  onCambiarEstado: (id: number) => void;
  onEditar: (usuario: Usuario) => void;
  canEdit?: boolean;
}

export const UserTable = ({
  usuarios,
  onEliminar,
  onCambiarEstado,
  onEditar,
  canEdit = true,
}: UserTableProps) => {
  const [menuAbiertoId, setMenuAbiertoId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbiertoId(null);
      }
    };

    document.addEventListener('mousedown', handleClickFuera);
    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#F97316] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
    <tr className="bg-[#7C3AED] text-left">
              <th className="px-4 py-4 text-sm font-semibold text-white">Usuario</th>
              <th className="px-4 py-4 text-sm font-semibold text-white">Teléfono</th>
              <th className="px-4 py-4 text-sm font-semibold text-white">Dirección</th>
              <th className="px-4 py-4 text-sm font-semibold text-white">Rol</th>
              <th className="px-4 py-4 text-sm font-semibold text-white">Estado</th>
              <th className="px-4 py-4 text-sm font-semibold text-white">Creado</th>
              {canEdit && (
                <th className="px-4 py-4 text-sm font-semibold text-white text-right">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-black">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-[#F97316]/30 bg-white">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-black">{usuario.nombre}</p>
                      <p className="text-sm text-black/70">{usuario.correo}</p>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-black">{usuario.telefono}</td>
                  <td className="px-4 py-4 text-black">{usuario.direccion}</td>

                  <td className="px-4 py-4">
                    <span className="rounded-full border border-[#F97316] bg-[#F97316]/10 px-3 py-1 text-sm text-[#F97316]">
                      {usuario.rol}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-2 text-sm ${
                        usuario.estado === 'Activo'
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          usuario.estado === 'Activo'
                            ? 'bg-green-600'
                            : 'bg-red-600'
                        }`}
                      />
                      {usuario.estado}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-black">{usuario.creadoEn}</td>

                  {canEdit && (
                    <td className="relative px-4 py-4 text-right">
                      <div
                        className="inline-block"
                        ref={menuAbiertoId === usuario.id ? menuRef : null}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setMenuAbiertoId((prev) =>
                              prev === usuario.id ? null : usuario.id
                            )
                          }
                          className="rounded-lg px-3 py-2 text-[#F97316] hover:bg-[#F97316]/10"
                        >
                          ⋯
                        </button>

                        {menuAbiertoId === usuario.id && (
                          <div className="absolute right-4 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-[#F97316]/40 bg-white shadow-2xl">
                            <button
                              type="button"
                              onClick={() => {
                                onEditar(usuario);
                                setMenuAbiertoId(null);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left text-black hover:bg-[#F97316]/10"
                            >
                              <span>✎</span>
                              <span>Editar</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onCambiarEstado(usuario.id);
                                setMenuAbiertoId(null);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left text-black hover:bg-[#F97316]/10"
                            >
                              <span>⟳</span>
                              <span>
                                {usuario.estado === 'Activo'
                                  ? 'Desactivar'
                                  : 'Activar'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onEliminar(usuario.id);
                                setMenuAbiertoId(null);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50"
                            >
                              <span>🗑</span>
                              <span>Eliminar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};