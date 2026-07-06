import { API_ENDPOINTS, resolveApiEndpoint } from '~/utils/apiEndpoints'

export function useCustomersActions() {
  return {
    async fetchCustomers() {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch(resolveApiEndpoint(API_ENDPOINTS.customers.list))
        this.items = Array.isArray(response) ? response : []
      } catch (error) {
        this.error = error?.data?.statusMessage || error?.message || 'Unable to load customers'
        this.items = []
      } finally {
        this.loading = false
      }
    },

    async createCustomer(payload) {
      this.loading = true
      this.error = null

      try {
        const formData = new URLSearchParams({
          name: payload?.name || '',
          email: payload?.email || '',
          phone: payload?.phone || '',
          city: payload?.city || '',
        })

        const createdCustomer = await $fetch(resolveApiEndpoint(API_ENDPOINTS.customers.create), {
          method: 'POST',
          body: formData,
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        })

        await this.fetchCustomers()

        const { addToast } = useAppToast()
        addToast('Customer added successfully', 'success')

        return createdCustomer
      } catch (error) {
        const message = error?.data?.statusMessage || error?.message || 'Unable to create customer'
        this.error = message

        const { addToast } = useAppToast()
        addToast(message, 'error')
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCustomer(id) {
      this.loading = true
      this.error = null

      try {
        await $fetch(resolveApiEndpoint(API_ENDPOINTS.customers.delete), {
          method: 'DELETE',
          body: { id },
          headers: { 'content-type': 'application/json' },
        })

        await this.fetchCustomers()

        const { addToast } = useAppToast()
        addToast('Customer deleted successfully', 'success')
      } catch (error) {
        const message = error?.data?.statusMessage || error?.message || 'Unable to delete customer'
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
