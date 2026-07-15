import type { ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  ClienteOption,
  EspecieOption,
  MascotaFormValues,
  RazaOption,
} from "../types"
import { tamanoOptions } from "../store"

interface MascotaFormProps {
  values: MascotaFormValues
  clientes: ClienteOption[]
  especies: EspecieOption[]
  razas: RazaOption[]
  onChange: (
    field: keyof MascotaFormValues,
    value: string | number | boolean,
  ) => void
  onEspecieChange: (value: string) => void
}

const inputClassName =
  "h-12 rounded-xl border border-[#E4E4E7] bg-white text-[#18181B] placeholder:text-[#71717A] focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:border-[#8B5CF6]"

const selectClassName =
  "h-12 w-full rounded-xl border border-[#E4E4E7] bg-white px-3 text-[#18181B] outline-none transition focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]"

const labelClassName = "text-sm font-medium text-[#18181B]"

const optionStyle = {
  color: "#18181B",
  backgroundColor: "#FFFFFF",
}

export function MascotaForm({
  values,
  clientes,
  especies,
  razas,
  onChange,
  onEspecieChange,
}: MascotaFormProps) {
  const handleInput =
    (field: keyof MascotaFormValues) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
      const target = e.target as HTMLInputElement
      const value = target.type === "checkbox" ? target.checked : target.value
      onChange(field, value)
    }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-[#FED7AA] bg-[#FFFDFB] p-5">
        <h3 className="text-lg font-semibold text-[#7C3AED]">
          Datos principales
        </h3>
        <p className="mt-1 text-sm text-[#52525B]">
          Completa la información básica de la mascota.
        </p>

        <div className="mt-5 grid gap-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="id_usuario" className={labelClassName}>
                Propietario
              </Label>
              <select
                id="id_usuario"
                value={values.id_usuario}
                onChange={handleInput("id_usuario")}
                className={selectClassName}
                style={{ color: "#18181B", backgroundColor: "#FFFFFF" }}
              >
                <option value="" style={optionStyle}>
                  Selecciona un propietario
                </option>
                {clientes.map((usuario) => (
                  <option
                    key={usuario.id_usuario}
                    value={usuario.id_usuario}
                    style={optionStyle}
                  >
                    {usuario.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="id_especie" className={labelClassName}>
                Especie
              </Label>
              <select
                id="id_especie"
                value={values.id_especie}
                onChange={(e) => onEspecieChange(e.target.value)}
                className={selectClassName}
                style={{ color: "#18181B", backgroundColor: "#FFFFFF" }}
              >
                <option value="" style={optionStyle}>
                  Selecciona una especie
                </option>
                {especies.map((especie) => (
                  <option
                    key={especie.id_especie}
                    value={especie.id_especie}
                    style={optionStyle}
                  >
                    {especie.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="id_raza" className={labelClassName}>
                Raza
              </Label>
              <select
                id="id_raza"
                value={values.id_raza}
                onChange={handleInput("id_raza")}
                className={selectClassName}
                disabled={!values.id_especie}
                style={{ color: "#18181B", backgroundColor: "#FFFFFF" }}
              >
                <option value="" style={optionStyle}>
                  {values.id_especie
                    ? "Selecciona una raza"
                    : "Primero selecciona especie"}
                </option>
                {razas.map((raza) => (
                  <option
                    key={raza.id_raza}
                    value={raza.id_raza}
                    style={optionStyle}
                  >
                    {raza.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="nombre" className={labelClassName}>
                Nombre de la mascota
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Firulais"
                value={values.nombre}
                onChange={handleInput("nombre")}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="color" className={labelClassName}>
                Color
              </Label>
              <Input
                id="color"
                placeholder="Ej: Café"
                value={values.color}
                onChange={handleInput("color")}
                className={inputClassName}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sexo" className={labelClassName}>
                Sexo
              </Label>
              <select
                id="sexo"
                value={values.sexo}
                onChange={handleInput("sexo")}
                className={selectClassName}
                style={{ color: "#18181B", backgroundColor: "#FFFFFF" }}
              >
                <option value="MACHO" style={optionStyle}>
                  Macho
                </option>
                <option value="HEMBRA" style={optionStyle}>
                  Hembra
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="tamano" className={labelClassName}>
                Tamaño
              </Label>
              <select
                id="tamano"
                value={values.tamano}
                onChange={handleInput("tamano")}
                className={selectClassName}
                style={{ color: "#18181B", backgroundColor: "#FFFFFF" }}
              >
                {tamanoOptions.map((item) => (
                  <option key={item} value={item} style={optionStyle}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="peso" className={labelClassName}>
                Peso (kg)
              </Label>
              <Input
                id="peso"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ej: 12.50"
                value={values.peso}
                onChange={handleInput("peso")}
                className={inputClassName}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fecha_nac" className={labelClassName}>
                Fecha de nacimiento
              </Label>
              <Input
                id="fecha_nac"
                type="date"
                value={values.fecha_nac}
                onChange={handleInput("fecha_nac")}
                className={inputClassName}
              />
            </div>
          </div>
        </div>
      </div>

      <details className="rounded-2xl border border-[#FED7AA] bg-white p-5 open:shadow-sm">
        <summary className="cursor-pointer list-none select-none">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#7C3AED]">
                Información adicional
              </h3>
              <p className="mt-1 text-sm text-[#52525B]">
                Datos complementarios de la mascota.
              </p>
            </div>
            <span className="rounded-full bg-[#F5F3FF] px-3 py-1 text-sm font-medium text-[#7C3AED]">
              Opcional
            </span>
          </div>
        </summary>

        <div className="mt-5 grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="foto" className={labelClassName}>
              Foto
            </Label>
            <Input
              id="foto"
              placeholder="Ej: firulais.jpg"
              value={values.foto}
              onChange={handleInput("foto")}
              className={inputClassName}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="alergias" className={labelClassName}>
              Alergias
            </Label>
            <textarea
              id="alergias"
              placeholder="Ej: Alergia a ciertos alimentos o medicamentos"
              value={values.alergias}
              onChange={handleInput("alergias")}
              className="min-h-[100px] rounded-xl border border-[#E4E4E7] bg-white px-3 py-3 text-[#18181B] placeholder:text-[#71717A] outline-none transition focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notas_generales" className={labelClassName}>
              Notas generales
            </Label>
            <textarea
              id="notas_generales"
              placeholder="Observaciones importantes sobre la mascota"
              value={values.notas_generales}
              onChange={handleInput("notas_generales")}
              className="min-h-[120px] rounded-xl border border-[#E4E4E7] bg-white px-3 py-3 text-[#18181B] placeholder:text-[#71717A] outline-none transition focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]"
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#FFEDD5] bg-[#FFFDFB] px-4 py-4">
            <div>
              <p className="text-sm font-medium text-[#18181B]">Estado</p>
              <p className="text-sm text-[#52525B]">
                Define si la mascota se encuentra activa en el sistema.
              </p>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={Boolean(values.estado)}
                onChange={handleInput("estado")}
                className="h-5 w-5 rounded border-[#D4D4D8] text-[#7C3AED] focus:ring-[#8B5CF6]"
              />
              <span className="text-sm font-medium text-[#7C3AED]">
                {values.estado ? "Activo" : "Inactivo"}
              </span>
            </label>
          </div>
        </div>
      </details>
    </div>
  )
}