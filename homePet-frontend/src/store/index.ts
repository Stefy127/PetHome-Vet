// Configuración principal del store
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Hooks fuertemente tipados
export * from './hooks';

// Autenticación (slice, selectors, types)
export * from './auth/authSlice';
export * from './auth/auth.selectors';
export type * from './auth/auth.types';
export * from './auth/authApi';

// API global y tipos
export { api } from './api/api';
export * from './api/tagTypes';
export type * from './api/api.types';
