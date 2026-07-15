import { createFileRoute } from '@tanstack/react-router'
import { DashboardScreen } from '@/app/features/dashboard/screen/DashboardScreen'

export const Route = createFileRoute('/_admin/dashboard')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return <DashboardScreen />
}
