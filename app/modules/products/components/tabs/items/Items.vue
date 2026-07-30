<script setup>
import EditIcon from "~/assets/icons/edit.vue";
import DeleteIcon from "~/assets/icons/delete.vue";
import { ref, computed } from "vue";
const toasts = useState('app-toasts', () => [])

const addToast = (message, type = 'success', duration = 3000) => {
  const toast = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    message,
    type,
    duration
  }
  toasts.value = [...toasts.value, toast]
  if (duration > 0) {
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toast.id)
    }, duration)
  }
  return toast.id
}
const refreshTrigger = ref(0);
const page = ref(1);
const editingItem = ref(null);
const editForm = ref({ name: "", description: "", price: "", categoryId: "", image: null, color: "", variantGroupId: "", length: "", width: "", stock: "", isGiftGuide: false });
const editImagePreview = ref(null);
const editImageRemoved = ref(false);
const editItemImageInput = ref(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref(null);
const activeCategoryTab = ref("all");
const categoriesRefreshTrigger = ref(0);
const search = ref("");

watch(refreshTrigger, () => {
  page.value = 1;
});
watch(activeCategoryTab, () => {
  page.value = 1;
});
watch(search, () => {
  page.value = 1;
});

const {
  data: itemsPage,
  pending: loading,
  error,
  refresh,
} = await useApiFetch("/api/products", {
  query: computed(() => ({
    page: page.value,
    limit: 10,
    ...(activeCategoryTab.value !== "all" ? { categoryId: activeCategoryTab.value } : {}),
    ...(search.value.trim() ? { search: search.value.trim() } : {}),
  })),
  default: () => ({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } }),
  watch: [refreshTrigger, page, activeCategoryTab, search],
});

const items = computed(() => itemsPage.value?.data || []);
const pageMeta = computed(() => itemsPage.value?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });

const { data: categories, refresh: refreshCategories } = await useApiFetch("/api/categories", {
  default: () => [],
  watch: [categoriesRefreshTrigger],
});

const tableColumns = [
  { key: "image", label: "Image", width: "100px" },
  { key: "name", label: "Item Name", width: "200px" },
  { key: "description", label: "Description", width: "auto" },
  { key: "price", label: "Price", width: "100px" },
  { key: "stock", label: "Stock", width: "100px" },
  { key: "actions", label: "Actions", width: "100px" },
];

const categoryTabs = computed(() => {
  return [
    { id: "all", label: "All Items" },
    ...categories.value.map(cat => ({ id: cat.id.toString(), label: cat.name }))
  ];
});


function handleDeleteItem(item) {
  itemToDelete.value = item;
  showDeleteConfirm.value = true;
}

async function confirmDeleteItem() {
  if (!itemToDelete.value) return;
  
  try {
    await apiFetch(`/api/products/${itemToDelete.value.id}`, {
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
  // Fetch the product fresh by id rather than trusting the (possibly stale) row
  // object from the list, so the preview always reflects what's really in the DB.
  const fresh = await apiFetch(`/api/products/${item.id}`);
  editingItem.value = fresh;
  editForm.value = {
    name: fresh.name,
    description: fresh.description,
    price: fresh.price,
    categoryId: fresh.categoryId,
    image: null,
    color: fresh.color || "",
    variantGroupId: fresh.variantGroupId || "",
    length: fresh.length || "",
    width: fresh.width || "",
    stock: fresh.stock ?? "",
    isGiftGuide: !!fresh.isGiftGuide,
  };
  editImagePreview.value = fresh.image || null;
  editImageRemoved.value = false;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function handleEditImageChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  editImageRemoved.value = false;
  editImagePreview.value = await readFileAsDataUrl(file);
  editForm.value.image = file;
}

function handleRemoveEditImage() {
  editForm.value.image = null;
  editImagePreview.value = null;
  editImageRemoved.value = true;
}

async function handleUpdateItem() {
  try {
    const body = {
      name: editForm.value.name,
      description: editForm.value.description,
      price: editForm.value.price,
      categoryId: editForm.value.categoryId,
      color: editForm.value.color,
      variantGroupId: editForm.value.variantGroupId,
      length: editForm.value.length,
      width: editForm.value.width,
      stock: editForm.value.stock,
      isGiftGuide: editForm.value.isGiftGuide,
    };
    if (editForm.value.image) {
      body.image = editImagePreview.value;
    } else if (editImageRemoved.value) {
      body.image = NO_IMAGE_PLACEHOLDER;
    }

    await apiFetch(`/api/products/${editingItem.value.id}`, {
      method: "PUT",
      body,
    });

    addToast("Item updated successfully", "success");
    editingItem.value = null;
    editForm.value = { name: "", description: "", price: "", categoryId: "", image: null, color: "", variantGroupId: "", length: "", width: "", stock: "", isGiftGuide: false };
    editImagePreview.value = null;
    editImageRemoved.value = false;
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
  refreshTrigger,
});
</script>

<template>
  <div>

 <div class="border-b border-gray-200 mb-6 w-full">
        <div class="flex gap-4 custom-scrollbar overflow-x-auto">
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
      <div class="mb-5 flex justify-end">
        <input
          v-model="search"
          type="text"
          placeholder="Search items by name..."
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--theme-color)]"
        />
      </div>

      <!-- Category Subtabs -->
      <div v-if="loading" class="text-gray-500">Loading items...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <div v-else-if="items.length === 0" class="text-gray-500 py-8">
        No items available. Create a category first, then add items.
      </div>
      <CommonTable
        v-else
        :columns="tableColumns"
        :data="items"
        pagination
        :page="pageMeta.page"
        :total-pages="pageMeta.totalPages"
        :total="pageMeta.total"
        :limit="pageMeta.limit"
        @page-change="page = $event"
      >
        <template #cell-image="{ row }">
          <img
            :src="row.image && row.image.startsWith('data:image') ? row.image : NO_IMAGE_PLACEHOLDER"
            :alt="row.name"
            class="w-12 h-12 rounded-lg object-cover"
            @error="(e) => e.target.src = NO_IMAGE_PLACEHOLDER"
          />
        </template>
        <template #cell-price="{ row }">
          {{ row.price ? `$${parseFloat(row.price).toFixed(2)}` : '-' }}
        </template>
        <template #cell-stock="{ row }">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            :class="row.stock <= 0
              ? 'bg-red-50 text-red-700'
              : row.stock <= row.lowStockThreshold
                ? 'bg-amber-50 text-amber-700'
                : 'bg-green-50 text-green-700'"
          >
            {{ row.stock }}
          </span>
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
            Stock Quantity
          </label>
          <input
            v-model.number="editForm.stock"
            type="number"
            min="0"
            placeholder="Enter stock quantity"
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
            Color
          </label>
          <input
            v-model="editForm.color"
            type="text"
            placeholder="e.g. Gold-Clear"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Variant Group ID
          </label>
          <input
            v-model="editForm.variantGroupId"
            type="number"
            placeholder="e.g. 39147"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
          />
          <p class="text-gray-500 text-xs mt-1">
            Use the same number across color variants of the same design to link them together.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Length (cm)
            </label>
            <input
              v-model="editForm.length"
              type="number"
              step="0.1"
              placeholder="e.g. 1.2"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Width (cm)
            </label>
            <input
              v-model="editForm.width"
              type="number"
              step="0.1"
              placeholder="e.g. 1.2"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            />
          </div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              v-model="editForm.isGiftGuide"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-[var(--theme-color)] focus:ring-[var(--theme-color)]"
            />
            Show in Gift Guide
          </label>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Item Image
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--theme-color)] transition-colors cursor-pointer relative">
            <input
              ref="editItemImageInput"
              type="file"
              accept="image/*"
              @change="handleEditImageChange"
              class="hidden"
            />
            <div @click="editItemImageInput?.click()" class="cursor-pointer">
              <div v-if="!editForm.image && !editImagePreview" class="text-gray-500">
                <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm">Click to upload new image</p>
              </div>
              <div v-else class="relative inline-block w-full">
                <img 
                  v-if="editImagePreview" 
                  :src="editImagePreview" 
                  alt="Preview" 
                  class="w-full h-auto object-cover rounded-lg"
                />
                <div class="absolute top-2 right-2">
                  <button
                    type="button"
                    @click.prevent="handleRemoveEditImage"
                    class="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                    title="Remove image"
                  >
                    <DeleteIcon />
                  </button>
                </div>
                <p v-if="editForm.image" class="text-sm font-medium mt-2">{{ editForm.image.name }}</p>
                <p v-else class="text-sm font-medium mt-2">Current image</p>
              </div>
            </div>
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