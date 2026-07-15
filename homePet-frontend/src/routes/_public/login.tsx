import { createFileRoute } from '@tanstack/react-router'
import LoginScreen from '@/app/features/AutenticacionySeguridad/login/screen/LoginScreen'

export const Route = createFileRoute('/_public/login')({
  component: LoginScreen,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      register: Boolean(search.register),
    }
  },
})
