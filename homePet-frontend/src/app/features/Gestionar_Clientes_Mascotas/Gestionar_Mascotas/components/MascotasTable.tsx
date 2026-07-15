import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react"
import type { Mascota } from "../types"
import { useCanDelete, useCanEdit } from "#/store/components/component.hooks"

interface MascotasTableProps {
  mascotas: Mascota[]
  onViewDetails: (mascota: Mascota) => void
  onEdit: (mascota: Mascota) => void
  onDelete: (mascota: Mascota) => void
}

function getEspecieMascota(mascota: Mascota) {
  return mascota.especie?.nombre ?? "Sin especie"
}

function getRazaMascota(mascota: Mascota) {
  return mascota.raza?.nombre ?? "Sin raza"
}

function getEspecieBadgeClass(especie: string) {
  switch (especie.toLowerCase()) {
    case "perro":
      return "bg-sky-50 text-sky-700 border border-sky-200"
    case "gato":
      return "bg-amber-50 text-amber-700 border border-amber-200"
    case "conejo":
      return "bg-rose-50 text-rose-700 border border-rose-200"
    case "ave":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200"
    default:
      return "bg-zinc-50 text-zinc-700 border border-zinc-200"
  }
}

function getEstadoBadgeClass(estado: boolean) {
  return estado
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-red-50 text-red-700 border border-red-200"
}

function getNombrePropietario(mascota: Mascota) {
  return mascota.usuario?.nombre ?? "Sin propietario"
}

interface ActionMenuProps {
  mascota: Mascota
  onViewDetails: (mascota: Mascota) => void
  onEdit: (mascota: Mascota) => void
  onDelete: (mascota: Mascota) => void
}

type MenuPosition = {
  top: number
  left: number
}

function ActionMenu({
  mascota,
  onViewDetails,
  onEdit,
  onDelete,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    left: 0,
  })

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return

    const updatePosition = () => {
      if (!triggerRef.current) return

      const rect = triggerRef.current.getBoundingClientRect()
      const menuWidth = 208
      const menuHeight = 150
      const gap = 8
      const viewportPadding = 12

      const spaceBelow = window.innerHeight - rect.bottom
      const openUpward = spaceBelow < menuHeight + gap

      let top = openUpward ? rect.top - menuHeight - gap : rect.bottom + gap
      let left = rect.right - menuWidth

      if (left < viewportPadding) left = viewportPadding
      if (left + menuWidth > window.innerWidth - viewportPadding) {
        left = window.innerWidth - menuWidth - viewportPadding
      }
      if (top < viewportPadding) top = viewportPadding
      if (top + menuHeight > window.innerHeight - viewportPadding) {
        top = window.innerHeight - menuHeight - viewportPadding
      }

      setMenuPosition({ top, left })
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  const itemClassName =
    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition"

  const canEdit = useCanEdit("CLI_MASCOTAS")
  const canDelete = useCanDelete("CLI_MASCOTAS")

  const menu =
    open && mounted
      ? createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPosition.top,
              left: menuPosition.left,
              width: 208,
              zIndex: 1000,
            }}
            className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
          >
            <button
              type="button"
              onClick={() => {
                onViewDetails(mascota)
                setOpen(false)
              }}
              className={`${itemClassName} text-[#374151] hover:bg-[#F9FAFB]`}
            >
              <Eye className="h-4 w-4 text-[#7C3AED]" />
              <span>Ver detalles</span>
            </button>

            {canEdit && (
              <button
                type="button"
                onClick={() => {
                  onEdit(mascota)
                  setOpen(false)
                }}
                className={`${itemClassName} border-t border-[#F3F4F6] text-[#374151] hover:bg-[#FFF7ED]`}
              >
                <Pencil className="h-4 w-4 text-[#F97316]" />
                <span>Editar</span>
              </button>
            )}

            {canDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(mascota)
                  setOpen(false)
                }}
                className={`${itemClassName} border-t border-[#F3F4F6] text-red-600 hover:bg-red-50`}
              >
                <Trash2 className="h-4 w-4" />
                <span>Eliminar</span>
              </button>
            )}
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E9D5FF] bg-white text-[#7C3AED] transition hover:border-[#D8B4FE] hover:bg-[#FAF5FF]"
        aria-label="Abrir acciones"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {menu}
    </>
  )
}

function MobileMascotaCard({
  mascota,
  onViewDetails,
  onEdit,
  onDelete,
}: ActionMenuProps) {
  const especie = getEspecieMascota(mascota)
  const raza = getRazaMascota(mascota)

  return (
    <div className="rounded-2xl border border-[#FDBA74] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            {mascota.nombre}
          </h3>
          <p className="mt-1 text-sm text-[#6B7280]">
            {getNombrePropietario(mascota)}
          </p>
        </div>

        <ActionMenu
          mascota={mascota}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getEspecieBadgeClass(
            especie,
          )}`}
        >
          {especie}
        </span>

        <span className="inline-flex rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-xs font-medium text-[#374151]">
          {raza}
        </span>

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getEstadoBadgeClass(
            mascota.estado,
          )}`}
        >
          {mascota.estado ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#FFFDFB] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7C3AED]">
            Color
          </p>
          <p className="mt-1 text-sm text-[#18181B]">
            {mascota.color ?? "-"}
          </p>
        </div>

        <div className="rounded-xl bg-[#FFFDFB] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7C3AED]">
            Sexo
          </p>
          <p className="mt-1 text-sm text-[#18181B]">
            {mascota.sexo ?? "-"}
          </p>
        </div>

        <div className="rounded-xl bg-[#FFFDFB] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7C3AED]">
            Tamaño
          </p>
          <p className="mt-1 text-sm text-[#18181B]">
            {mascota.tamano ?? "-"}
          </p>
        </div>

        <div className="rounded-xl bg-[#FFFDFB] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7C3AED]">
            Peso
          </p>
          <p className="mt-1 text-sm text-[#18181B]">
            {mascota.peso ?? "-"} {mascota.peso ? "kg" : ""}
          </p>
        </div>
      </div>
    </div>
  )
}

export function MascotasTable({
  mascotas,
  onViewDetails,
  onEdit,
  onDelete,
}: MascotasTableProps) {
  return (
    <>
      <div className="space-y-4 md:hidden">
        {mascotas.length === 0 ? (
          <div className="rounded-2xl border border-[#FDBA74] bg-white px-6 py-10 text-center text-[#6B7280]">
            No hay mascotas registradas
          </div>
        ) : (
          mascotas.map((mascota) => (
            <MobileMascotaCard
              key={mascota.id_mascota}
              mascota={mascota}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-[#FDBA74] bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] text-white">
              <tr className="text-left">
                <th className="px-6 py-4 font-semibold">Nombre</th>
                <th className="px-6 py-4 font-semibold">Especie</th>
                <th className="px-6 py-4 font-semibold">Raza</th>
                <th className="px-6 py-4 font-semibold">Propietario</th>
                <th className="px-6 py-4 font-semibold">Color</th>
                <th className="px-6 py-4 font-semibold">Sexo</th>
                <th className="px-6 py-4 font-semibold">Tamaño</th>
                <th className="px-6 py-4 font-semibold">Peso</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 text-right font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {mascotas.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-10 text-center text-[#6B7280]"
                  >
                    No hay mascotas registradas
                  </td>
                </tr>
              ) : (
                mascotas.map((mascota) => {
                  const especie = getEspecieMascota(mascota)

                  return (
                    <tr
                      key={mascota.id_mascota}
                      className="border-b border-[#FFEDD5] transition-colors last:border-b-0 hover:bg-[#FFFDF9]"
                    >
                      <td className="px-6 py-4 font-semibold text-[#111827]">
                        {mascota.nombre}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getEspecieBadgeClass(
                            especie,
                          )}`}
                        >
                          {especie}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[#4B5563]">
                        {getRazaMascota(mascota)}
                      </td>

                      <td className="px-6 py-4 text-[#4B5563]">
                        {getNombrePropietario(mascota)}
                      </td>

                      <td className="px-6 py-4 text-[#4B5563]">
                        {mascota.color ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-[#4B5563]">
                        {mascota.sexo ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-[#4B5563]">
                        {mascota.tamano ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-[#4B5563]">
                        {mascota.peso ?? "-"} {mascota.peso ? "kg" : ""}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getEstadoBadgeClass(
                            mascota.estado,
                          )}`}
                        >
                          {mascota.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end">
                          <ActionMenu
                            mascota={mascota}
                            onViewDetails={onViewDetails}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}