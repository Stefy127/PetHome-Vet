import { api } from '../api/api';
import type {
  CheckoutDemoConfirmRequest,
  CheckoutDemoConfirmResponse,
  CheckoutDemoStartRequest,
  CheckoutDemoStartResponse,
  TrialSignupRequest,
  UpgradeDemoConfirmRequest,
  UpgradeDemoConfirmResponse,
  UpgradeDemoStartRequest,
  UpgradeDemoStartResponse,
} from './billing.types';
import type { LoginResponse } from '../auth/auth.types';

export const billingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    trialSignup: builder.mutation<LoginResponse, TrialSignupRequest>({
      query: (body) => ({
        url: '/auth/public/trial-signup/',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): LoginResponse => ({
        access: response.access,
        refresh: response.refresh,
        usuario: response.context.usuario,
        veterinaria: response.context.veterinaria,
        plan: response.context.plan,
        componentes: response.context.componentes,
      }),
    }),
    checkoutDemoStart: builder.mutation<
      CheckoutDemoStartResponse,
      CheckoutDemoStartRequest
    >({
      query: (body) => ({
        url: '/auth/public/checkout-demo/start/',
        method: 'POST',
        body,
      }),
    }),
    checkoutDemoConfirm: builder.mutation<
      CheckoutDemoConfirmResponse,
      CheckoutDemoConfirmRequest
    >({
      query: (body) => ({
        url: '/auth/public/checkout-demo/confirm/',
        method: 'POST',
        body,
      }),
    }),
    upgradeDemoStart: builder.mutation<
      UpgradeDemoStartResponse,
      UpgradeDemoStartRequest
    >({
      query: (body) => ({
        url: '/auth/billing/upgrade-demo/start/',
        method: 'POST',
        body,
      }),
    }),
    upgradeDemoConfirm: builder.mutation<
      UpgradeDemoConfirmResponse,
      UpgradeDemoConfirmRequest
    >({
      query: (body) => ({
        url: '/auth/billing/upgrade-demo/confirm/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useTrialSignupMutation,
  useCheckoutDemoStartMutation,
  useCheckoutDemoConfirmMutation,
  useUpgradeDemoStartMutation,
  useUpgradeDemoConfirmMutation,
} = billingApi;
