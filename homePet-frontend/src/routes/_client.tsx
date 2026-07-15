import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardLayoutClient } from '@/app/features/dashboard/components/DashboardLayoutcliente'
import { authApi } from '#/store/auth/authApi'
import { store } from '#/store/store'

export const Route = createFileRoute('/_client')({
  beforeLoad: async () => {
    if (typeof window === 'undefined') return

    const { isAuthenticated, accessToken, user } = store.getState().auth

    if (!isAuthenticated && !accessToken) {
      throw redirect({
        to: '/login',
        search: {
          register: false,
        },
      })
    }

    if (user?.role !== 'CLIENT' && accessToken) {
      const profileRequest = store.dispatch(
        authApi.endpoints.me.initiate(undefined, { forceRefetch: true }),
      )

      let shouldGoDashboard = false

      try {
        const profile = await profileRequest.unwrap()
        shouldGoDashboard = profile.usuario.role !== 'CLIENT'
      } catch {
        throw redirect({
          to: '/login',
          search: {
            register: false,
          },
        })
      } finally {
        profileRequest.unsubscribe()
      }

      if (shouldGoDashboard) {
        throw redirect({ to: '/dashboard' })
      }
    }
  },
  component: ClientLayoutComponent,
})

function ClientLayoutComponent() {
  return (
    <DashboardLayoutClient>
      <Outlet />
    </DashboardLayoutClient>
  )
}
