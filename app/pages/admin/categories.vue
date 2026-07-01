<template>
  <NuxtLayout name="admin">
    <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Categories</h1>

      <div class="fixed top-4 right-4 z-[60] space-y-2">
        <div v-for="toast in toasts" :key="toast.id" class="rounded-lg px-4 py-3 text-sm shadow-lg text-white" :class="toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'">
          {{ toast.message }}
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-6">
          <p class="text-gray-600">Manage your jewellery categories</p>
          <button class="bg-[#4E0FA6] text-white px-4 py-2 rounded-lg" @click="openCreateModal">
            Add Category
          </button>
        </div>

        <div v-if="loading" class="text-gray-500">Loading categories...</div>
        <div v-else-if="error" class="text-red-600">{{ error }}</div>
        <div v-else-if="categories.length === 0" class="text-gray-500">No categories found.</div>
        <div v-else class="grid gap-4 md:grid-cols-2">
          <div v-for="category in categories" :key="category.id" class="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
            <div>
              <h2 class="font-semibold text-gray-800">{{ category.name }}</h2>
              <p class="text-sm text-gray-600 mt-1">{{ category.description }}</p>
            </div>
            <button class="text-red-500 text-sm" @click="handleDeleteCategory(category.id)">Remove</button>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl w-full max-w-md p-6">
          <h2 class="text-xl font-semibold mb-4">Create Category</h2>
          <form @submit.prevent="handleCreateCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input v-model="form.name" class="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="form.description" class="w-full border rounded-lg px-3 py-2" rows="3" required />
            </div>
            <div class="flex justify-end gap-3">
              <button type="button" class="px-4 py-2 rounded-lg border" @click="showModal = false">Cancel</button>
              <button type="submit" class="px-4 py-2 rounded-lg bg-[#4E0FA6] text-white">Save</button>
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

const showModal = ref(false)
const form = ref({ name: '', description: '' })
const toasts = ref([])

const { data: categories, pending: loading, error, refresh } = await useFetch('/api/categories', {
  default: () => []
})

function addToast(message, type = 'success') {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }, 2500)
}

function openCreateModal() {
  form.value = { name: '', description: '' }
  showModal.value = true
}

async function handleCreateCategory() {
  try {
    await $fetch('/api/categories', {
      method: 'POST',
      body: new URLSearchParams({
        name: form.value.name,
        description: form.value.description,
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
    showModal.value = false
    form.value = { name: '', description: '' }
    addToast('Category created', 'success')
    await refresh()
  } catch (error) {
    addToast(error?.data?.statusMessage || 'Unable to create category', 'error')
  }
}

async function handleDeleteCategory(id) {
  try {
    await $fetch('/api/categories', {
      method: 'DELETE',
      body: new URLSearchParams({ id: String(id) }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
    addToast('Category deleted', 'success')
    await refresh()
  } catch (error) {
    addToast(error?.data?.statusMessage || 'Unable to delete category', 'error')
  }
}
</script>
