export function useCategoriesStore() {
  const items = useState('categories-items', () => [])
  const loading = useState('categories-loading', () => false)
  const error = useState('categories-error', () => null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/categories')
      items.value = response
    } catch (err) {
      error.value = err?.message || 'Unable to load categories'
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    fetchCategories,
  }
}
