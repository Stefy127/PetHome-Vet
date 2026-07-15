import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/app/features/dashboard/components/DashboardLayout'
import { store } from '#/store/store'
//import { authApi } from '#/store/auth/authApi'

export const Route = createFileRoute('/_admin')({
  beforeLoad: async () => {
    // In SSR we cannot read localStorage-backed auth state; enforce auth on client.
    if (typeof window === 'undefined') {
      return
    }

    const { isAuthenticated, accessToken, user } = store.getState().auth

    if (!isAuthenticated || !accessToken) {
      throw redirect({
        to: '/login',
        search: {
          register: false,
        },
      })
    }

    if (user?.role === 'CLIENT') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: AuthLayoutComponent,
})

function AuthLayoutComponent() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
