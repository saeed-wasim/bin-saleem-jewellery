// Hydrates the admin JWT from localStorage as early as possible in the
// client lifecycle, so every page's first fetch has it available instead of
// racing against whichever component happens to call loadFromStorage() first.
export default defineNuxtPlugin(() => {
  useAuth().loadFromStorage()
})
