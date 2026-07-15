function normalizeRole(value?: string | null) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
}

function extractRole(source: unknown) {
  if (!source) return ''

  if (typeof source === 'string') {
    return normalizeRole(source)
  }

  if (typeof source !== 'object') return ''
  const record = source as Record<string, unknown>

  const fromRole = record.role
  if (typeof fromRole === 'string') {
    return normalizeRole(fromRole)
  }
  if (fromRole && typeof fromRole === 'object') {
    const roleName = (fromRole as Record<string, unknown>).nombre
    if (typeof roleName === 'string') return normalizeRole(roleName)
  }

  const fromRol = record.rol
  if (typeof fromRol === 'string') {
    return normalizeRole(fromRol)
  }
  if (fromRol && typeof fromRol === 'object') {
    const roleName = (fromRol as Record<string, unknown>).nombre
    if (typeof roleName === 'string') return normalizeRole(roleName)
  }

  return ''
}

export function canAccessVentasModule(roleOrUser?: unknown) {
  const normalized = extractRole(roleOrUser)
  return (
    normalized === 'ADMIN' ||
    normalized === 'ADMINISTRADOR' ||
    normalized === 'VETERINARIAN' ||
    normalized === 'VETERINARIO'
  )
}
