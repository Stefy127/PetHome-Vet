import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { PrecioServicio, PrecioServicioPayload, Servicio } from '../store'

import { PrecioServicioForm } from './PrecioServicioForm'

interface PrecioServicioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  servicios: Servicio[]
  precio?: PrecioServicio | null
  onSubmit: (values: PrecioServicioPayload) => Promise<void> | void
  isLoading?: boolean
}
export const PrecioServicioDialog = ({
  open,
  onOpenChange,
  servicios,
  precio,
  onSubmit,
  isLoading = false,
}: PrecioServicioDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{precio ? 'Editar precio' : 'Nuevo precio'}</DialogTitle>
        </DialogHeader>
        <PrecioServicioForm
          servicios={servicios}
          precio={precio}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
