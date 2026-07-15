import { useEffect, useState, type FormEvent } from 'react';
import type {
  Usuario,
  UsuarioFormData,
  UserRole,
  UserStatus,
} from '../store';

interface UserFormModalProps {
  open: boolean;
  modo: 'crear' | 'editar';
  usuarioInicial?: Usuario | null;
  onClose: () => void;
  onSave: (data: UsuarioFormData) => Promise<void> | void;
}

const initialForm: UsuarioFormData = {
  nombre: '',
  correo: '',
  telefono: '',
  direccion: '',
  rol: 'Veterinario',
  estado: 'Activo',
};

export const UserFormModal = ({
  open,
  modo,
  usuarioInicial,
  onClose,
  onSave,
}: UserFormModalProps) => {
  const [form, setForm] = useState<UsuarioFormData>(initialForm);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSubmitError(null);
    setIsSubmitting(false);

    if (modo === 'editar' && usuarioInicial) {
      setForm({
        nombre: usuarioInicial.nombre,
        correo: usuarioInicial.correo,
        telefono: usuarioInicial.telefono,
        direccion: usuarioInicial.direccion,
        rol: usuarioInicial.rol,
        estado: usuarioInicial.estado,
      });
    } else {
      setForm(initialForm);
    }
  }, [open, modo, usuarioInicial]);

  if (!open) return null;

  const handleChange = (
    field: keyof UsuarioFormData,
    value: string | UserRole | UserStatus
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.nombre.trim() ||
      !form.correo.trim() ||
      !form.telefono.trim()
    ) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await onSave(form);
      setForm(initialForm);
      onClose();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setSubmitError('No se pudo guardar el usuario en backend. Verifica permisos o datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[#7C3AED] bg-[#7C3AED] p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {modo === 'editar' ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>
            <p className="mt-1 text-sm text-white/85">
              {modo === 'editar'
                ? 'Modifica los datos del usuario interno'
                : 'Completa los datos para registrar un nuevo usuario'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-white px-3 py-2 text-[#7C3AED] hover:opacity-90"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-white">Nombre</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className="h-11 w-full rounded-xl border border-white bg-white px-4 text-black outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-white">Correo</label>
            <input
              type="email"
              value={form.correo}
              onChange={(e) => handleChange('correo', e.target.value)}
              className="h-11 w-full rounded-xl border border-white bg-white px-4 text-black outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Teléfono</label>
            <input
              type="text"
              value={form.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className="h-11 w-full rounded-xl border border-white bg-white px-4 text-black outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Dirección</label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              className="h-11 w-full rounded-xl border border-white bg-white px-4 text-black outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Rol</label>
            <select
              value={form.rol}
              onChange={(e) => handleChange('rol', e.target.value as UserRole)}
              className="h-11 w-full rounded-xl border border-white bg-white px-4 text-black outline-none"
            >
              <option value="Administrador">Administrador</option>
              <option value="Veterinario">Veterinario</option>
              <option value="Recepcionista">Recepcionista</option>
              <option value="Cliente">Cliente</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => handleChange('estado', e.target.value as UserStatus)}
              className="h-11 w-full rounded-xl border border-white bg-white px-4 text-black outline-none"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            {submitError && (
              <p className="mr-auto rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
                {submitError}
              </p>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl bg-white px-5 py-2.5 text-[#7C3AED] hover:opacity-90"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#F97316] px-5 py-2.5 font-medium text-white hover:opacity-90"
            >
              {isSubmitting
                ? 'Guardando...'
                : modo === 'editar'
                  ? 'Guardar cambios'
                  : 'Guardar usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};