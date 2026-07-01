export const API_ENDPOINTS = {
  customers: {
    list: '/api/customers',
    create: '/api/customers',
    delete: '/api/customers',
  },
  categories: {
    list: '/api/categories',
    create: '/api/categories',
    delete: '/api/categories',
  },
}

export function resolveApiEndpoint(endpoint) {
  const runtimeConfig = useRuntimeConfig()
  const baseUrl = runtimeConfig?.public?.backendUrl || ''
  const normalizedBase = baseUrl.replace(/\/$/, '')
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  return normalizedBase ? `${normalizedBase}${normalizedEndpoint}` : normalizedEndpoint
}
