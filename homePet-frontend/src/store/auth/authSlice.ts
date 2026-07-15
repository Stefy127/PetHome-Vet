import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from './auth.types'

const AUTH_STORAGE_KEY = 'homePet_auth'

function loadPersistedAuth() {
  if (typeof window === 'undefined') {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
    }
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
      }
    }

    const parsed = JSON.parse(raw) as {
      user?: User | null
      accessToken?: string | null
      refreshToken?: string | null
    }

    return {
      user: parsed.user ?? null,
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
    }
  } catch {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
    }
  }
}

function persistAuth(state: AuthState) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      user: state.user,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    }),
  )
}

const persisted = loadPersistedAuth()

const initialState: AuthState = {
  user: persisted.user,
  accessToken: persisted.accessToken,
  refreshToken: persisted.refreshToken,
  isAuthenticated: Boolean(persisted.accessToken && persisted.user),
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User
        accessToken: string
        refreshToken: string
      }>,
    ) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.isAuthenticated = true
      state.error = null
      persistAuth(state)
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      state.isAuthenticated = Boolean(state.user)
      persistAuth(state)
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = Boolean(state.accessToken)
      persistAuth(state)
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      persistAuth(state)
    },
  },
})

export const { setCredentials, setAccessToken, updateUser, logout } =
  authSlice.actions
export default authSlice.reducer
