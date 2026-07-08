<template>
  <NuxtLayout name="admin">
    <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Customers</h1>

      <div class="fixed top-4 right-4 z-[60] space-y-2">
        <div v-for="toast in toasts" :key="toast.id" class="rounded-lg px-4 py-3 text-sm shadow-lg text-white" :class="toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'">
          {{ toast.message }}
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-6">
          <p class="text-gray-600">Customers management page</p>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">{{ customerCount }} customers</span>
            <button class="bg-theme text-white px-4 py-2 rounded-lg" @click="openCreateModal">
              Add Customer
            </button>
          </div>
        </div>

        <div v-if="loading" class="text-gray-500">Loading customers...</div>
        <div v-else-if="error" class="text-red-600">{{ error }}</div>
        <div v-else-if="customers.length === 0" class="text-gray-500">No customers found.</div>
        <div v-else class=" custom-scrollbar overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-700">City</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in customers" :key="customer.id" class="border-t border-gray-100">
                <td class="px-4 py-3 text-gray-800">{{ customer.name }}</td>
                <td class="px-4 py-3 text-gray-600">{{ customer.email }}</td>
                <td class="px-4 py-3 text-gray-600">{{ customer.phone }}</td>
                <td class="px-4 py-3 text-gray-600">{{ customer.city }}</td>
                <td class="px-4 py-3">
                  <button class="text-red-500 text-sm" @click="handleDeleteCustomer(customer.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl w-full max-w-md p-6">
          <h2 class="text-xl font-semibold mb-4">Create Customer</h2>
          <form @submit.prevent="handleCreateCustomer" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input v-model="form.name" class="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="form.email" type="email" class="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input v-model="form.phone" class="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input v-model="form.city" class="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div class="flex justify-end gap-3">
              <button type="button" class="px-4 py-2 rounded-lg border" @click="showModal = false">Cancel</button>
              <button type="submit" class="px-4 py-2 rounded-lg bg-theme text-white">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})
const store = useCustomersStore()
const { toasts, addToast } = useAppToast()
const showModal = ref(false)
const form = ref({ name: '', email: '', phone: '', city: '' })

const customers = computed(() => store.items)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const customerCount = computed(() => store.customerCount)

onMounted(() => {
  store.fetchCustomers()
})

function openCreateModal() {
  form.value = { name: '', email: '', phone: '', city: '' }
  showModal.value = true
}

async function handleCreateCustomer() {
  try {
    await store.createCustomer({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      city: form.value.city,
    })
    showModal.value = false
    form.value = { name: '', email: '', phone: '', city: '' }
  } catch (error) {
    addToast(error?.data?.statusMessage || 'Unable to create customer', 'error')
  }
}

async function handleDeleteCustomer(id) {
  try {
    await store.deleteCustomer(id)
  } catch (error) {
    addToast(error?.data?.statusMessage || 'Unable to delete customer', 'error')
  }
}
</script>
