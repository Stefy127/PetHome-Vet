import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { CategoriaServicio, Servicio, ServicioPayload } from '../store'
import { ServicioForm } from './ServicioForm'

interface ServicioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categorias: CategoriaServicio[]
  servicio?: Servicio | null
  onSubmit: (values: ServicioPayload) => Promise<void> | void
  isLoading?: boolean
}
export const ServicioDialog = ({
  open,
  onOpenChange,
  categorias,
  servicio,
  onSubmit,
  isLoading = false,
}: ServicioDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {servicio ? 'Editar servicio' : 'Nuevo servicio'}
          </DialogTitle>
        </DialogHeader>
        <ServicioForm
          categorias={categorias}
          servicio={servicio}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
