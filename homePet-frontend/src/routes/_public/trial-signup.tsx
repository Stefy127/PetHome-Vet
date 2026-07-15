import { useState } from 'react';
import type { FormEvent } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { useTrialSignup } from '#/hooks/useTrialSignup';
import type { TrialSignupRequest } from '#/store/billing/billing.types';

const initialForm: TrialSignupRequest = {
  veterinaria_nombre: '',
  veterinaria_slug: '',
  veterinaria_correo: '',
  veterinaria_telefono: '',
  veterinaria_direccion: '',
  admin_nombre: '',
  admin_correo: '',
  admin_password: '',
  admin_telefono: '',
  admin_direccion: '',
};

export const Route = createFileRoute('/_public/trial-signup')({
  component: TrialSignupPage,
});

function TrialSignupPage() {
  const { submit, isLoading, error, fieldErrors } = useTrialSignup();
  const [form, setForm] = useState<TrialSignupRequest>(initialForm);
  const [validationError, setValidationError] = useState<string | null>(null);

  const update = (key: keyof TrialSignupRequest, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const safeSlug = form.veterinaria_slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(safeSlug)) {
      setValidationError('El slug debe estar en minusculas, sin espacios.');
      return;
    }
    if (form.admin_password.length < 8) {
      setValidationError('La contrasena debe tener al menos 8 caracteres.');
      return;
    }
    setValidationError(null);
    await submit({ ...form, veterinaria_slug: safeSlug });
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-white">Prueba gratis por 7 dias</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-xl bg-white p-6 text-slate-900 sm:grid-cols-2">
        <Input placeholder="Nombre veterinaria*" value={form.veterinaria_nombre} onChange={(e) => update('veterinaria_nombre', e.target.value)} required />
        <Input placeholder="Slug veterinaria* (minusculas y sin espacios)" title="Solo minúsculas, números y guion" value={form.veterinaria_slug} onChange={(e) => update('veterinaria_slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))} pattern="^[a-z0-9-]+$" required />
        <Input placeholder="Correo veterinaria" value={form.veterinaria_correo || ''} onChange={(e) => update('veterinaria_correo', e.target.value)} />
        <Input placeholder="Telefono veterinaria" value={form.veterinaria_telefono || ''} onChange={(e) => update('veterinaria_telefono', e.target.value)} />
        <Input placeholder="Direccion veterinaria" value={form.veterinaria_direccion || ''} onChange={(e) => update('veterinaria_direccion', e.target.value)} />
        <div />
        <Input placeholder="Nombre admin*" value={form.admin_nombre} onChange={(e) => update('admin_nombre', e.target.value)} required />
        <Input placeholder="Correo admin*" type="email" value={form.admin_correo} onChange={(e) => update('admin_correo', e.target.value)} required />
        <Input placeholder="Password admin* (min 8 caracteres)" type="password" minLength={8} value={form.admin_password} onChange={(e) => update('admin_password', e.target.value)} required />
        <Input placeholder="Telefono admin" value={form.admin_telefono || ''} onChange={(e) => update('admin_telefono', e.target.value)} />
        <Input placeholder="Direccion admin" value={form.admin_direccion || ''} onChange={(e) => update('admin_direccion', e.target.value)} />
        {fieldErrors.veterinaria_slug?.[0] ? <p className="sm:col-span-2 text-sm text-red-600">{fieldErrors.veterinaria_slug[0]}</p> : null}
        {fieldErrors.admin_correo?.[0] ? <p className="sm:col-span-2 text-sm text-red-600">{fieldErrors.admin_correo[0]}</p> : null}
        {fieldErrors.veterinaria_correo?.[0] ? <p className="sm:col-span-2 text-sm text-red-600">{fieldErrors.veterinaria_correo[0]}</p> : null}
        {validationError ? <p className="sm:col-span-2 text-sm text-red-600">{validationError}</p> : null}
        {error ? <p className="sm:col-span-2 text-sm text-red-600">{error}</p> : null}

        <Button disabled={isLoading} type="submit" className="sm:col-span-2 bg-[#F97316] hover:bg-[#EA580C]">
          {isLoading ? 'Creando trial...' : 'Crear trial'}
        </Button>
      </form>
    </main>
  );
}
