import { Input } from "@/components/ui/input"

interface Props {
  search: string
  setSearch: (val: string) => void
  filterEstado: string
  setFilterEstado: (val: string) => void
}

export function FilterSection({
  search,
  setSearch,
  filterEstado,
  setFilterEstado,
}: Props) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
      <Input
        placeholder="Buscar por mascota, especie, raza, propietario u observaciones..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-14 rounded-2xl border-2 border-violet-500 px-4 text-base text-violet-700 placeholder:text-violet-400"
      />

      <select
        value={filterEstado}
        onChange={(e) => setFilterEstado(e.target.value)}
        className="h-14 rounded-2xl border-2 border-violet-500 bg-white px-4 text-base text-violet-700 outline-none"
      >
        <option value="todos">Todos</option>
        <option value="con_consultas">Con consultas</option>
        <option value="sin_consultas">Sin consultas</option>
        <option value="activos">Activos</option>
        <option value="inactivos">Inactivos</option>
      </select>
    </section>
  )
}
