import { useState, useMemo } from 'react';
import { useGetBitacorasQuery } from '../store/bitacoraApi';
import { BitacoraTable } from '../components/BitacoraTable';
import { useForm } from '@tanstack/react-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, Calendar as CalendarIcon, FilterX } from 'lucide-react';
import type { BitacoraFilters } from '../store/bitacora.types';

// Importaciones de shadcn/ui para los componentes de formulario
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export default function BitacoraScreen() {
  const [filters, setFilters] = useState<BitacoraFilters>({ page: 1 });

  // Petición a la API con los filtros actuales
  const { data, isLoading, isFetching } = useGetBitacorasQuery(filters);
  // Instancia de TanStack Form
  const form = useForm({
    defaultValues: {
      descripcion: '',
      modulo: 'all', // Usamos 'all' por defecto para el Select
      fecha_desde: undefined as Date | undefined,
      fecha_hasta: undefined as Date | undefined,
    },
    onSubmit: async ({ value }) => {
      // Formatear fechas a YYYY-MM-DD para el backend de Django
      const fechaDesdeFormateada = value.fecha_desde 
        ? format(value.fecha_desde, 'yyyy-MM-dd') 
        : undefined;
        
      const fechaHastaFormateada = value.fecha_hasta 
        ? format(value.fecha_hasta, 'yyyy-MM-dd') 
        : undefined;

      setFilters({
        ...filters,
        page: 1, // Reset a página 1 al buscar
        descripcion: value.descripcion || undefined,
        modulo: value.modulo !== 'all' ? value.modulo : undefined,
        fecha_desde: fechaDesdeFormateada,
        fecha_hasta: fechaHastaFormateada,
      });
    },
  });

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const totalPages = useMemo(() => {
    if (!data?.count) return 1;
    return Math.ceil(data.count / 10);
  }, [data?.count]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bitácora del Sistema</h1>
          <p className="text-gray-500 mt-1">
            Auditoría de acciones realizadas por los usuarios y el sistema.
          </p>
        </div>
      </div>

      {/* Contenedor de Filtros */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-wrap gap-4 items-end">
            {/* Filtro: Búsqueda de Texto */}
            <div className="flex-1 min-w-[250px]">
              <form.Field name="descripcion">
                {(field) => (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Buscar descripción, acción..."
                      className="pl-9 bg-white text-black border-gray-300"
                    />
                  </div>
                )}
              </form.Field>
            </div>

            {/* Filtro: Select de Módulo */}
            <div className="w-[180px]">
              <form.Field name="modulo">
                {(field) => (
                  <Select 
                    value={field.state.value} 
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger className="bg-white text-black border-gray-300">
                      <SelectValue placeholder="Módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los módulos</SelectItem>
                      <SelectItem value="autenticacion">Autenticación</SelectItem>
                      <SelectItem value="usuarios">Usuarios</SelectItem>
                      <SelectItem value="perfiles">Perfiles</SelectItem>
                      <SelectItem value="roles">Roles</SelectItem>
                      <SelectItem value="permisos">Permisos</SelectItem>
                      <SelectItem value="sistema">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </form.Field>
            </div>

            {/* Filtro: Fecha Desde (Popover + Calendar) */}
            <div className="w-[180px]">
              <form.Field name="fecha_desde">
                {(field) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal border-gray-300 bg-white text-black ${
                          !field.state.value && "text-gray-500"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.state.value ? (
                          format(field.state.value, "PP", { locale: es })
                        ) : (
                          <span>Fecha desde</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.state.value}
                        onSelect={field.handleChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </form.Field>
            </div>

            {/* Filtro: Fecha Hasta (Popover + Calendar) */}
            <div className="w-[180px]">
              <form.Field name="fecha_hasta">
                {(field) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal border-gray-300 bg-white text-black ${
                          !field.state.value && "text-gray-500"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.state.value ? (
                          format(field.state.value, "PP", { locale: es })
                        ) : (
                          <span>Fecha hasta</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.state.value}
                        onSelect={field.handleChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </form.Field>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="bg-[#F97316] text-white hover:bg-[#EA580C]"
                disabled={isLoading || isFetching}
              >
                Filtrar
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  form.reset();
                  setFilters({ page: 1 });
                }}
                title="Limpiar filtros"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Tabla de Resultados */}
      <BitacoraTable
        data={data?.results || []}
        isLoading={isLoading || isFetching}
        page={filters.page || 1}
        totalPages={totalPages}
        hasNext={!!data?.next}
        hasPrevious={!!data?.previous}
        onPageChange={handlePageChange}
      />
    </div>
  );
}