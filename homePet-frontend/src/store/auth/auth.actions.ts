import { type AppDispatch } from '../store';
import { logout as logoutAuth } from './authSlice';
import { clearTenant } from '../tenant/tenantSlice';
import { clearComponents } from '../components/componentSlice';
import { api } from '../api/api';

const LOCAL_KEYS_TO_CLEAR = [
  'homePet_auth',
  'auth',
  'token',
  'user',
  'tenant',
  'menu',
  'menu_cache',
];

export const performFullLogout = (dispatch: AppDispatch) => {
  dispatch(logoutAuth());
  dispatch(clearTenant());
  dispatch(clearComponents());
  dispatch(api.util.resetApiState());
};

export const clearClientSessionData = () => {
  if (typeof window === 'undefined') return;

  for (const key of LOCAL_KEYS_TO_CLEAR) {
    window.localStorage.removeItem(key);
  }

  Object.keys(window.localStorage)
    .filter((key) => key.startsWith('homePet_'))
    .forEach((key) => window.localStorage.removeItem(key));

  window.sessionStorage.clear();
};
