import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '#/components/ui/button'

type ErrorStateProps = {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/40 px-6 text-center">
      <AlertTriangle className="h-10 w-10 text-red-500" />
      <p className="mt-3 text-sm font-semibold text-red-700">{message}</p>
      {onRetry && (
        <Button
          type="button"
          onClick={onRetry}
          variant="outline"
          className="mt-4 border-red-200 bg-white text-red-700 hover:bg-red-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      )}
    </div>
  )
}

