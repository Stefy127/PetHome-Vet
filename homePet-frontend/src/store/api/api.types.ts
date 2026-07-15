export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
}
