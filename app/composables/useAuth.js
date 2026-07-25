const TOKEN_KEY = 'bs_admin_token'
const USER_KEY = 'bs_admin_user'

export function useAuth() {
  const token = useState('auth-token', () => null)
  const user = useState('auth-user', () => null)

  function loadFromStorage() {
    if (import.meta.client && token.value === null) {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedUser = localStorage.getItem(USER_KEY)
      token.value = storedToken || ''
      user.value = storedUser ? JSON.parse(storedUser) : null
    }
  }

  async function login(email, password) {
    const config = useRuntimeConfig()
    const response = await $fetch('/api/auth/login', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      body: { email, password },
    })

    token.value = response.token
    user.value = response.user

    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    }

    return response
  }

  function logout() {
    token.value = ''
    user.value = null

    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }

  return {
    token,
    user,
    isAuthenticated: computed(() => !!token.value),
    loadFromStorage,
    login,
    logout,
  }
}
