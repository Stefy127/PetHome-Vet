import { Filter, Search } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

type Option = {
  value: string
  label: string
}

type SeguimientoFiltersProps = {
  mode: 'seguimientos' | 'pedidos'
  searchTerm: string
  estado: string
  secondary: string
  fechaDesde: string
  fechaHasta: string
  isLoading?: boolean
  estadoOptions: Option[]
  secondaryOptions: Option[]
  onSearchTermChange: (value: string) => void
  onEstadoChange: (value: string) => void
  onSecondaryChange: (value: string) => void
  onFechaDesdeChange: (value: string) => void
  onFechaHastaChange: (value: string) => void
  onApply: () => void
  onClear: () => void
}

export function SeguimientoFilters({
  mode,
  searchTerm,
  estado,
  secondary,
  fechaDesde,
  fechaHasta,
  isLoading,
  estadoOptions,
  secondaryOptions,
  onSearchTermChange,
  onEstadoChange,
  onSecondaryChange,
  onFechaDesdeChange,
  onFechaHastaChange,
  onApply,
  onClear,
}: SeguimientoFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-violet-100 bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <label htmlFor="buscar-seguimientos" className="mb-1 block text-xs font-medium text-gray-600">
            Buscar
          </label>
          <Search className="pointer-events-none absolute top-8 left-3 h-4 w-4 text-violet-400" />
          <Input
            id="buscar-seguimientos"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Buscar por cliente, mascota o código..."
            className="h-10 border-violet-200 pl-9 text-sm"
          />
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="estado-select-trigger" className="mb-1 block text-xs font-medium text-gray-600">
            Estado
          </label>
          <Select value={estado} onValueChange={onEstadoChange} disabled={isLoading}>
            <SelectTrigger id="estado-select-trigger" className="h-10 w-full border-violet-200 text-sm">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {estadoOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="secondary-select-trigger" className="mb-1 block text-xs font-medium text-gray-600">
            {mode === 'pedidos' ? 'Tipo entrega' : 'Visible cliente'}
          </label>
          <Select value={secondary} onValueChange={onSecondaryChange} disabled={isLoading}>
            <SelectTrigger id="secondary-select-trigger" className="h-10 w-full border-violet-200 text-sm">
              <SelectValue placeholder={mode === 'pedidos' ? 'Tipo' : 'Visible'} />
            </SelectTrigger>
            <SelectContent>
              {secondaryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="lg:col-span-3">
          <label className="mb-1 block text-xs font-medium text-gray-600">Rango de fecha</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={fechaDesde}
              onChange={(event) => onFechaDesdeChange(event.target.value)}
              className="h-10 border-violet-200 text-sm"
            />
            <Input
              type="date"
              value={fechaHasta}
              onChange={(event) => onFechaHastaChange(event.target.value)}
              className="h-10 border-violet-200 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={onApply}
          disabled={isLoading}
          className="h-10 bg-orange-500 px-6 text-white hover:bg-orange-600"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>

        <Button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          variant="outline"
          className="h-10 border-violet-200 text-violet-700 hover:bg-violet-50"
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}

