import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { CategoriaServicio, CategoriaServicioPayload } from '../store'
import { CategoriaServicioForm } from './CategoriaServicioForm'

interface CategoriaServicioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoria?: CategoriaServicio | null
  onSubmit: (values: CategoriaServicioPayload) => Promise<void> | void
  isLoading?: boolean
}
export const CategoriaServicioDialog = ({
  open,
  onOpenChange,
  categoria,
  onSubmit,
  isLoading = false,
}: CategoriaServicioDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {categoria ? 'Editar categoría' : 'Nueva categoría'}
          </DialogTitle>
        </DialogHeader>

        <CategoriaServicioForm
          categoria={categoria}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
