import type { ReactNode } from 'react'
import { Card, CardContent } from '#/components/ui/card'

interface StatCardProps {
  title: string
  value?: string | number
  trend: string
  trendUp?: boolean
  hasError?: boolean
  icon: ReactNode
  iconBgSpan: string
}

export function StatCard({
  title,
  value,
  trend,
  trendUp = true,
  hasError = false,
  icon,
  iconBgSpan,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex h-40 flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgSpan}`}
          >
            {icon}
          </div>
        </div>
        <div>
          <div className="mb-2 text-3xl font-bold text-gray-900">{value ?? '--'}</div>
          <p
            className={`text-xs font-semibold ${hasError ? 'text-red-500' : trendUp ? 'text-green-500' : 'text-red-500'}`}
          >
            {trend}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
