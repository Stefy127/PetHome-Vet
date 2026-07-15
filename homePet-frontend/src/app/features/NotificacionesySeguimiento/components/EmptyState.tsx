import { Inbox } from 'lucide-react'

type EmptyStateProps = {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-violet-200 bg-white px-6 text-center">
      <Inbox className="h-10 w-10 text-violet-400" />
      <p className="mt-3 text-sm font-semibold text-gray-900">{message}</p>
    </div>
  )
}

