export interface TrialSignupRequest {
  veterinaria_nombre: string;
  veterinaria_slug: string;
  veterinaria_correo?: string;
  veterinaria_telefono?: string;
  veterinaria_direccion?: string;
  admin_nombre: string;
  admin_correo: string;
  admin_password: string;
  admin_telefono?: string;
  admin_direccion?: string;
}

export interface CheckoutDemoStartRequest {
  plan_id: number;
  veterinaria_nombre: string;
  veterinaria_slug: string;
  veterinaria_correo?: string;
  veterinaria_telefono?: string;
  veterinaria_direccion?: string;
  admin_nombre: string;
  admin_correo: string;
  admin_password: string;
  admin_telefono?: string;
  admin_direccion?: string;
}

export interface CheckoutDemoStartResponse {
  checkout_token: string;
  event_id?: string;
  expires_at?: string;
  payment_mode?: string;
  checkout_url: string;
  detail?: string;
}

export interface CheckoutDemoConfirmRequest {
  checkout_token: string;
}

export interface CheckoutDemoConfirmResponse {
  detail?: string;
  status?: string;
}

export interface UpgradeDemoStartRequest {
  plan_id: number;
}

export interface UpgradeDemoStartResponse {
  checkout_token: string;
  expires_at?: string;
}

export interface UpgradeDemoConfirmRequest {
  checkout_token: string;
}

export interface UpgradeDemoConfirmResponse {
  detail?: string;
  status?: string;
}
