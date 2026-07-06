<script setup>
import EditIcon from "~/assets/icons/edit.vue";
import DeleteIcon from "~/assets/icons/delete.vue";
import { ref, computed } from "vue";

const toasts = ref([]);
const refreshTrigger = ref(0);
const editingItem = ref(null);
const editForm = ref({ name: "", description: "", price: "", categoryId: "", image: null });
const editImagePreview = ref(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref(null);
const activeCategoryTab = ref("all");
const categoriesRefreshTrigger = ref(0);

const {
  data: items,
  pending: loading,
  error,
  refresh,
} = await useFetch("/api/items", {
  default: () => [],
  watch: [refreshTrigger],
});

const { data: categories, refresh: refreshCategories } = await useFetch("/api/categories", {
  default: () => [],
  watch: [categoriesRefreshTrigger],
});

const tableColumns = [
  { key: "image", label: "Image", width: "100px" },
  { key: "name", label: "Item Name", width: "200px" },
  { key: "description", label: "Description", width: "auto" },
  { key: "price", label: "Price", width: "100px" },
  { key: "actions", label: "Actions", width: "100px" },
];

const filteredItems = computed(() => {
  if (activeCategoryTab.value === "all") {
    return items.value;
  }
  return items.value.filter(item => item.category_id === parseInt(activeCategoryTab.value));
});

const categoryTabs = computed(() => {
  return [
    { id: "all", label: "All Items" },
    ...categories.value.map(cat => ({ id: cat.id.toString(), label: cat.name }))
  ];
});

function addToast(message, type = "success") {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }, 2500);
}

function handleDeleteItem(item) {
  itemToDelete.value = item;
  showDeleteConfirm.value = true;
}

async function confirmDeleteItem() {
  if (!itemToDelete.value) return;
  
  try {
    await $fetch(`/api/items/${itemToDelete.value.id}`, {
      method: "DELETE",
    });
    addToast("Item deleted", "success");
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
    await refresh();
  } catch (error) {
    addToast(
      error?.data?.statusMessage || "Unable to delete item",
      "error",
    );
  }
}

async function handleEditItem(item) {
  await refreshCategories();
  editingItem.value = item;
  editForm.value = {
    name: item.name,
    description: item.description,
    price: item.price,
    categoryId: item.category_id,
    image: null
  };
  editImagePreview.value = item.image || null;
}

async function handleUpdateItem() {
  try {
    const formData = new FormData();
    formData.append('name', editForm.value.name);
    formData.append('description', editForm.value.description);
    formData.append('price', editForm.value.price);
    formData.append('categoryId', editForm.value.categoryId);
    if (editForm.value.image) {
      formData.append('image', editForm.value.image);
    }
    
    await $fetch(`/api/items/${editingItem.value.id}`, {
      method: "PUT",
      body: formData,
    });
    
    addToast("Item updated successfully", "success");
    editingItem.value = null;
    editForm.value = { name: "", description: "", price: "", categoryId: "", image: null };
    editImagePreview.value = null;
    await refresh();
  } catch (error) {
    addToast(
      error?.data?.statusMessage || "Unable to update item",
      "error",
    );
  }
}

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

 <div class="border-b border-gray-200 mb-6 w-full">
        <div class="flex gap-4 overflow-x-auto">
          <button
            v-for="tab in categoryTabs"
            :key="tab.id"
            @click="activeCategoryTab = tab.id"
            :class="[
              'px-4 py-2 font-medium text-sm tracking-wide transition-colors',
              activeCategoryTab === tab.id
                ? 'text-[var(--theme-color)] border-b-2 border-[var(--theme-color)]'
                : 'text-gray-600 hover:text-gray-800',
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

    <div class="bg-white rounded-lg shadow p-6">
      <!-- Category Subtabs -->
      <div v-if="loading" class="text-gray-500">Loading items...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <div v-else-if="filteredItems.length === 0" class="text-gray-500 py-8">
        No items available. Create a category first, then add items.
      </div>
      <CommonTable v-else :columns="tableColumns" :data="filteredItems">
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
        <template #cell-price="{ row }">
          {{ row.price ? `$${parseFloat(row.price).toFixed(2)}` : '-' }}
        </template>
        <template #cell-actions="{ row }">
          <div class="flex gap-2">
            <button
              @click="handleEditItem(row)"
              class="text-blue-600 hover:text-blue-800 transition-colors"
              title="Edit"
            >
              <EditIcon />
            </button>
            <button
              @click="handleDeleteItem(row)"
              class="text-red-600 hover:text-red-800 transition-colors"
              title="Delete"
            >
              <DeleteIcon />
            </button>
          </div>
        </template>
      </CommonTable>
    </div>

    <!-- Edit Item Drawer -->
    <CommonDrawer
      v-if="editingItem"
      :show="!!editingItem"
      title="Edit Item"
      @close="editingItem = null"
      @confirm="handleUpdateItem"
    >
      <form @submit.prevent="handleUpdateItem" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Item Name
          </label>
          <input
            v-model="editForm.name"
            type="text"
            placeholder="Enter item name"
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
            Price
          </label>
          <input
            v-model="editForm.price"
            type="number"
            step="0.01"
            placeholder="Enter price"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Category
          </label>
          <select
            v-model="editForm.categoryId"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            required
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Item Image
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
              id="edit-item-image"
            />
            <label for="edit-item-image" class="cursor-pointer">
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
      title="Delete Item"
      :message='`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`'
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @close="showDeleteConfirm = false; itemToDelete = null"
      @confirm="confirmDeleteItem"
    />
  </div>
</template>