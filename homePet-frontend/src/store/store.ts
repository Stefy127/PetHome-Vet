import { configureStore } from '@reduxjs/toolkit';
import { api } from './api/api';
import authReducer from './auth/authSlice';
import tenantReducer from './tenant/tenantSlice';
import componentReducer from './components/componentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    components: componentReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
  devTools: import.meta.env.DEV, // using vite standard env var inside browser context
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
