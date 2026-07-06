import { API_ENDPOINTS, resolveApiEndpoint } from '~/utils/apiEndpoints'

export function useItemsActions() {
  return {
    async fetchItems() {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch(resolveApiEndpoint(API_ENDPOINTS.items.list))
        this.items = Array.isArray(response) ? response : []
      } catch (error) {
        this.error = error?.data?.statusMessage || error?.message || 'Unable to load items'
        this.items = []
      } finally {
        this.loading = false
      }
    },

    async createItem(payload) {
      this.loading = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append('name', payload?.name || '')
        formData.append('description', payload?.description || '')
        formData.append('price', payload?.price || '')
        formData.append('categoryId', payload?.categoryId || '')
        if (payload?.image) {
          formData.append('image', payload.image)
        }

        const createdItem = await $fetch(resolveApiEndpoint(API_ENDPOINTS.items.create), {
          method: 'POST',
          body: formData,
        })

        await this.fetchItems()

        const { addToast } = useAppToast()
        addToast('Item added successfully', 'success')

        return createdItem
      } catch (error) {
        const message = error?.data?.statusMessage || error?.message || 'Unable to create item'
        this.error = message

        const { addToast } = useAppToast()
        addToast(message, 'error')
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteItem(id) {
      this.loading = true
      this.error = null

      try {
        await $fetch(`${resolveApiEndpoint(API_ENDPOINTS.items.delete)}/${id}`, {
          method: 'DELETE',
        })

        await this.fetchItems()

        const { addToast } = useAppToast()
        addToast('Item deleted successfully', 'success')
      } catch (error) {
        const message = error?.data?.statusMessage || error?.message || 'Unable to delete item'
        this.error = message

        const { addToast } = useAppToast()
        addToast(message, 'error')
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateItem(id, payload) {
      this.loading = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append('name', payload?.name || '')
        formData.append('description', payload?.description || '')
        formData.append('price', payload?.price || '')
        formData.append('categoryId', payload?.categoryId || '')
        if (payload?.image) {
          formData.append('image', payload.image)
        }

        const updatedItem = await $fetch(`${resolveApiEndpoint(API_ENDPOINTS.items.update)}/${id}`, {
          method: 'PUT',
          body: formData,
        })

        await this.fetchItems()

        const { addToast } = useAppToast()
        addToast('Item updated successfully', 'success')

        return updatedItem
      } catch (error) {
        const message = error?.data?.statusMessage || error?.message || 'Unable to update item'
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
