<script setup>
import { ref } from "vue";
import PageHeading from "~/components/common/PageHeading.vue";
import Categories from "./tabs/categories/Categories.vue";
import Items from "./tabs/items/Items.vue";

const activeTab = ref("categories");
const showCategoryModal = ref(false);
const categoryForm = ref({ name: "", description: "" });
const isLoading = ref(false);
const categoriesRef = ref(null);
const toasts = ref([]);

const tabs = [
  { id: "categories", label: "Categories", component: Categories },
  { id: "items", label: "Items", component: Items },
];

function addToast(message, type = "success") {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }, 2500);
}

function openCreateCategoryModal() {
  categoryForm.value = { name: "", description: "" };
  showCategoryModal.value = true;
}

async function handleCreateCategory() {
  try {
    isLoading.value = true;
    await $fetch("/api/categories", {
      method: "POST",
      body: new URLSearchParams({
        name: categoryForm.value.name,
        description: categoryForm.value.description,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    showCategoryModal.value = false;
    categoryForm.value = { name: "", description: "" };
    addToast("Category created successfully", "success");
    
    // Refresh categories list
    if (categoriesRef.value?.refresh) {
      await categoriesRef.value.refresh();
    }
  } catch (error) {
    addToast(
      error?.data?.statusMessage || "Unable to create category",
      "error",
    );
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="tw-px-5">
    <!-- Toasts -->
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

    <PageHeading
      heading="Products Management"
      description="Curate and manage your luxury jewelry inventory."
    >
      <template #actions>
        <button
          v-if="activeTab === 'items'"
          class="px-5 py-2.5 bg-[var(--theme-color)] text-white rounded-md uppercase text-xs font-semibold tracking-wider hover:opacity-90 transition"
        >
         Create Item
        </button>

        <button
          v-else
          @click="openCreateCategoryModal"
          class="px-5 py-2.5 bg-[var(--theme-color)] text-white rounded-md uppercase text-xs font-semibold tracking-wider hover:opacity-90 transition"
        >
          Create Category
        </button>
      </template>
    </PageHeading>

    <!-- Tabs -->
    <div class="mt-6 border-b border-gray-200">
      <div class="flex gap-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-3 font-medium text-sm tracking-wide transition-colors',
            activeTab === tab.id
              ? 'text-[var(--theme-color)] border-b-2 border-[var(--theme-color)]'
              : 'text-gray-600 hover:text-gray-800',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <Categories v-if="activeTab === 'categories'" ref="categoriesRef" />
      <component v-else :is="tabs.find((t) => t.id === activeTab)?.component" />
    </div>

    <!-- Create Category Modal -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl w-full max-w-md p-6">
        <h2 class="text-xl font-semibold mb-4">Create Category</h2>
        <form @submit.prevent="handleCreateCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              v-model="categoryForm.name"
              type="text"
              placeholder="Enter category name"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--theme-color)]"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="categoryForm.description"
              placeholder="Enter category description"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--theme-color)]"
              rows="3"
              required
            />
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="showCategoryModal = false"
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="px-4 py-2 rounded-lg bg-[var(--theme-color)] text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {{ isLoading ? "Creating..." : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
