<script setup>
import { ref } from "vue";

const toasts = ref([]);
const refreshTrigger = ref(0);

const {
  data: categories,
  pending: loading,
  error,
  refresh,
} = await useFetch("/api/categories", {
  default: () => [],
  watch: [refreshTrigger],
});

function addToast(message, type = "success") {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }, 2500);
}

async function handleDeleteCategory(id) {
  try {
    await $fetch("/api/categories", {
      method: "DELETE",
      body: new URLSearchParams({ id: String(id) }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    addToast("Category deleted", "success");
    await refresh();
  } catch (error) {
    addToast(
      error?.data?.statusMessage || "Unable to delete category",
      "error",
    );
  }
}

// Expose refresh method to parent component
defineExpose({
  refresh,
  addToast,
});
</script>
<template>
  <div>
    <div class="fixed top-4 right-4 z-[60] space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="rounded-lg px-4 py-3 text-sm shadow-lg text-white"
        :class="toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'"
      >
        {{ toast.message }}
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div v-if="loading" class="text-gray-500">Loading categories...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <div v-else-if="categories.length === 0" class="text-gray-500 text-center py-8">
        No categories found.
      </div>
      <div v-else class="grid gap-4 md:grid-cols-2">
        <div
          v-for="category in categories"
          :key="category.id"
          class="border border-gray-200 rounded-lg p-4 flex items-start justify-between"
        >
          <div>
            <h2 class="font-semibold text-gray-800">{{ category.name }}</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ category.description }}
            </p>
          </div>
          <button
            class="text-red-500 text-sm hover:text-red-700 transition"
            @click="handleDeleteCategory(category.id)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>