// Guards /admin/* routes. Enforced client-side only — the JWT lives in
// localStorage, which isn't available during SSR.
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) {
    return
  }

  // Loading the token must never depend on requireAuth — plenty of pages
  // still make authenticated fetches even when the redirect-to-login guard
  // below is disabled, and they need the token hydrated regardless.
  const { isAuthenticated, loadFromStorage } = useAuth()
  loadFromStorage()

  const config = useRuntimeConfig()
  if (!config.public.requireAuth) {
    return
  }

  if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
    return
  }

  if (!isAuthenticated.value) {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
