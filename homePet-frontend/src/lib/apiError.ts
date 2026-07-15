type ErrorWithData = {
  status?: number | string;
  data?: unknown;
  error?: string;
};

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  const err = (error as ErrorWithData) || {};
  const data = err.data;

  if (data && typeof data === 'object') {
    const asRecord = data as Record<string, unknown>;
    const detail = asRecord.detail;
    if (typeof detail === 'string' && detail.trim()) return detail;
  }

  if (typeof data === 'string') {
    const trimmed = data.trim().toLowerCase();
    if (trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html')) {
      return 'Ocurrio un error del servidor, intente nuevamente.';
    }
  }

  if (err.status === 'PARSING_ERROR') {
    return 'Ocurrio un error del servidor, intente nuevamente.';
  }

  if (err.status === 500) {
    return 'Ocurrio un error del servidor, intente nuevamente.';
  }

  return fallback;
}
