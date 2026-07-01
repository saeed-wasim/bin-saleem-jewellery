import { API_ENDPOINTS, resolveApiEndpoint } from '~/utils/apiEndpoints'

export function useCategoriesActions() {
  return {
    async fetchCategories() {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch(resolveApiEndpoint(API_ENDPOINTS.categories.list))
        this.items = Array.isArray(response) ? response : []
      } catch (error) {
        this.error = error?.data?.statusMessage || error?.message || 'Unable to load categories'
        this.items = []
      } finally {
        this.loading = false
      }
    },

    async createCategory(payload) {
      this.loading = true
      this.error = null

      try {
        const formData = new URLSearchParams({
          name: payload?.name || '',
          description: payload?.description || '',
        })

        const createdCategory = await $fetch(resolveApiEndpoint(API_ENDPOINTS.categories.create), {
          method: 'POST',
          body: formData,
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        })

        await this.fetchCategories()

        const { addToast } = useAppToast()
        addToast('Category added successfully', 'success')

        return createdCategory
      } catch (error) {
        const message = error?.data?.statusMessage || error?.message || 'Unable to create category'
        this.error = message

        const { addToast } = useAppToast()
        addToast(message, 'error')
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(id) {
      this.loading = true
      this.error = null

      try {
        await $fetch(resolveApiEndpoint(API_ENDPOINTS.categories.delete), {
          method: 'DELETE',
          body: { id },
          headers: { 'content-type': 'application/json' },
        })

        await this.fetchCategories()

        const { addToast } = useAppToast()
        addToast('Category deleted successfully', 'success')
      } catch (error) {
        const message = error?.data?.statusMessage || error?.message || 'Unable to delete category'
        this.error = message

        const { addToast } = useAppToast()
        addToast(message, 'error')
        throw error
      } finally {
        this.loading = false
      }
    },
  }
}
