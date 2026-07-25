// Thin wrapper around $fetch / useFetch that targets the shared bs-backend
// and attaches the admin JWT (if present) to every request.

export function apiFetch(path, options = {}) {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const headers = { ...(options.headers || {}) }
  if (token.value) {
    headers.Authorization = `Bearer ${token.value}`
  }

  return $fetch(path, {
    baseURL: config.public.apiBaseUrl,
    ...options,
    headers,
  })
}

export function useApiFetch(path, options = {}) {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const headers = computed(() => {
    const h = { ...(options.headers || {}) }
    if (token.value) {
      h.Authorization = `Bearer ${token.value}`
    }
    return h
  })

  return useFetch(path, {
    baseURL: config.public.apiBaseUrl,
    ...options,
    headers,
  })
}
