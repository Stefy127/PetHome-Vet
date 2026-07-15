import { createFileRoute, Outlet } from '@tanstack/react-router'
import { MainLayoutClient } from '@/components/ui/Layout'

export const Route = createFileRoute('/_public')({
  component: () => (
    <MainLayoutClient>
      <Outlet />
    </MainLayoutClient>
  ),
})
