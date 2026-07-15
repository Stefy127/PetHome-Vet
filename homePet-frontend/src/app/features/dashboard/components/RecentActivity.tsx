import { Activity } from 'lucide-react'

export type ActivityItem = {
  id: string
  title: string
  description: string
  time: string
}

export function RecentActivity({
  items = [],
  isLoading = false,
  hasError = false,
}: {
  items?: ActivityItem[]
  isLoading?: boolean
  hasError?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-6 font-sans">
        Actividad Reciente
      </h3>

      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-gray-50 animate-pulse" />
          ))}
        </div>
      ) : hasError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          No se pudo cargar actividad reciente
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
          Sin actividad reciente
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          {items.map((activity) => (
            <div key={activity.id} className="flex gap-4 items-start">
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-purple-100 ring-4 ring-white">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div className="pt-1">
                <h4 className="text-sm font-bold text-gray-800">{activity.title}</h4>
                <p className="text-sm text-gray-500 mt-0.5">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
