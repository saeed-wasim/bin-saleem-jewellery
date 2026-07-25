// Guards /admin/* routes. Enforced client-side only — the JWT lives in
// localStorage, which isn't available during SSR.
export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  if (!config.public.requireAuth) {
    return
  }

  if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
    return
  }

  if (import.meta.server) {
    return
  }

  const { isAuthenticated, loadFromStorage } = useAuth()
  loadFromStorage()

  if (!isAuthenticated.value) {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
