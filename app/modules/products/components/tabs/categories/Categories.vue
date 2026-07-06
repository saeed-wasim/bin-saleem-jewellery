<script setup>
import EditIcon from "~/assets/icons/edit.vue";
import DeleteIcon from "~/assets/icons/delete.vue";
import { ref } from "vue";

const toasts = ref([]);
const refreshTrigger = ref(0);
const editingCategory = ref(null);
const editForm = ref({ name: "", description: "", image: null });
const editImagePreview = ref(null);

const {
  data: categories,
  pending: loading,
  error,
  refresh,
} = await useFetch("/api/categories", {
  default: () => [],
  watch: [refreshTrigger],
});

const tableColumns = [
  { key: "image", label: "Image", width: "100px" },
  { key: "name", label: "Title", width: "200px" },
  { key: "description", label: "Description", width: "auto" },
  { key: "actions", label: "Actions", width: "100px" },
];

function addToast(message, type = "success") {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }, 2500);
}

const showDeleteConfirm = ref(false);
const categoryToDelete = ref(null);

async function handleDeleteCategory(id) {
  categoryToDelete.value = categories.value.find(c => c.id === id);
  showDeleteConfirm.value = true;
}

async function confirmDeleteCategory() {
  if (!categoryToDelete.value) return;
  
  try {
    await $fetch(`/api/categories/${categoryToDelete.value.id}`, {
      method: "DELETE",
    });
    addToast("Category deleted", "success");
    showDeleteConfirm.value = false;
    categoryToDelete.value = null;
    await refresh();
  } catch (error) {
    addToast(
      error?.data?.statusMessage || "Unable to delete category",
      "error",
    );
  }
}

function handleEditCategory(category) {
  editingCategory.value = category;
  editForm.value = {
    name: category.name,
    description: category.description,
    image: null
  };
  editImagePreview.value = category.image || null;
}

async function handleUpdateCategory() {
  try {
    const formData = new FormData();
    formData.append('name', editForm.value.name);
    formData.append('description', editForm.value.description);
    if (editForm.value.image) {
      formData.append('image', editForm.value.image);
    }
    
    await $fetch(`/api/categories/${editingCategory.value.id}`, {
      method: "PUT",
      body: formData,
    });
    
    addToast("Category updated successfully", "success");
    editingCategory.value = null;
    editForm.value = { name: "", description: "", image: null };
    editImagePreview.value = null;
    await refresh();
  } catch (error) {
    addToast(
      error?.data?.statusMessage || "Unable to update category",
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
      <CommonTable v-else :columns="tableColumns" :data="categories">
        <template #cell-image="{ row }">
          <img
            v-if="row.image && row.image.startsWith('data:image')"
            :src="row.image"
            :alt="row.name"
            class="w-12 h-12 rounded-lg object-cover"
            @error="(e) => e.target.style.display = 'none'"
          />
          <span v-else class="text-gray-400">No image</span>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex gap-2">
            <button
              @click="handleEditCategory(row)"
              class="text-blue-600 hover:text-blue-800 transition-colors"
              title="Edit"
            >
              <EditIcon />
            </button>
            <button
              @click="handleDeleteCategory(row.id)"
              class="text-red-600 hover:text-red-800 transition-colors"
              title="Delete"
            >
              <DeleteIcon />
            </button>
          </div>
        </template>
      </CommonTable>
    </div>

    <!-- Edit Category Modal -->
    <CommonDrawer
      v-if="editingCategory"
      :show="!!editingCategory"
      title="Edit Category"
      @close="editingCategory = null"
      @confirm="handleUpdateCategory"
    >
      <form @submit.prevent="handleUpdateCategory" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Category Name
          </label>
          <input
            v-model="editForm.name"
            type="text"
            placeholder="Enter name"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            v-model="editForm.description"
            placeholder="Detail the materials, carat weight, and design inspiration..."
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            rows="4"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Category Image
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--theme-color)] transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              @change="(e) => {
                editForm.image = e.target.files[0];
                if (e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (ev) => editImagePreview.value = ev.target.result;
                  reader.readAsDataURL(e.target.files[0]);
                }
              }"
              class="hidden"
              id="edit-category-image"
            />
            <label for="edit-category-image" class="cursor-pointer">
              <div v-if="!editForm.image && !editImagePreview" class="text-gray-500">
                <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm">Click to upload new image</p>
              </div>
              <div v-else class="text-gray-700 w-full">
                <img 
                  v-if="editImagePreview" 
                  :src="editImagePreview" 
                  alt="Preview" 
                  class="w-full h-auto object-cover rounded-lg mb-2"
                />
                <p v-if="editForm.image" class="text-sm font-medium">{{ editForm.image.name }}</p>
                <p v-else class="text-sm font-medium">Current image</p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </CommonDrawer>

    <!-- Delete Confirmation Modal -->
    <CommonConfirmModal
      :show="showDeleteConfirm"
      title="Delete Category"
      :message='`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`'
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @close="showDeleteConfirm = false; categoryToDelete = null"
      @confirm="confirmDeleteCategory"
    />
  </div>
</template>