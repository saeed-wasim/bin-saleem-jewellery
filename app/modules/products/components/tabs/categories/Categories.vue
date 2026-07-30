<script setup>
import EditIcon from "~/assets/icons/edit.vue";
import DeleteIcon from "~/assets/icons/delete.vue";
import { ref } from "vue";
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
const search = ref("");
const editingCategory = ref(null);
const editForm = ref({ name: "", description: "", image: null });
const editImagePreview = ref(null);
const editImageRemoved = ref(false);
const editCategoryImageInput = ref(null);

watch(refreshTrigger, () => {
  page.value = 1;
});
watch(search, () => {
  page.value = 1;
});

const {
  data: categoriesPage,
  pending: loading,
  error,
  refresh,
} = await useApiFetch("/api/categories", {
  query: computed(() => ({
    page: page.value,
    limit: 10,
    ...(search.value.trim() ? { search: search.value.trim() } : {}),
  })),
  default: () => ({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } }),
  watch: [refreshTrigger, page, search],
});

const categories = computed(() => categoriesPage.value?.data || []);
const pageMeta = computed(() => categoriesPage.value?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });

const tableColumns = [
  { key: "image", label: "Image", width: "100px" },
  { key: "name", label: "Title", width: "200px" },
  { key: "description", label: "Description", width: "auto" },
  { key: "actions", label: "Actions", width: "100px" },
];


const showDeleteConfirm = ref(false);
const categoryToDelete = ref(null);

async function handleDeleteCategory(id) {
  categoryToDelete.value = categories.value.find(c => c.id === id);
  showDeleteConfirm.value = true;
}

async function confirmDeleteCategory() {
  if (!categoryToDelete.value) return;
  
  try {
    await apiFetch(`/api/categories/${categoryToDelete.value.id}`, {
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

async function handleEditCategory(category) {
  // Fetch the category fresh by id rather than trusting the (possibly stale) row
  // object from the list, so the preview always reflects what's really in the DB.
  const fresh = await apiFetch(`/api/categories/${category.id}`);
  editingCategory.value = fresh;
  editForm.value = {
    name: fresh.name,
    description: fresh.description,
    image: null
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

async function handleUpdateCategory() {
  try {
    const body = {
      name: editForm.value.name,
      description: editForm.value.description,
    };
    if (editForm.value.image) {
      body.image = editImagePreview.value;
    } else if (editImageRemoved.value) {
      body.image = NO_IMAGE_PLACEHOLDER;
    }

    await apiFetch(`/api/categories/${editingCategory.value.id}`, {
      method: "PUT",
      body,
    });

    addToast("Category updated successfully", "success");
    editingCategory.value = null;
    editForm.value = { name: "", description: "", image: null };
    editImagePreview.value = null;
    editImageRemoved.value = false;
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
  refreshTrigger,
});
</script>
<template>
  <div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-5 flex justify-end">
        <input
          v-model="search"
          type="text"
          placeholder="Search categories by name or description..."
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--theme-color)]"
        />
      </div>

      <div v-if="loading" class="text-gray-500">Loading categories...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <CommonTable
        v-else
        :columns="tableColumns"
        :data="categories"
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
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--theme-color)] transition-colors cursor-pointer relative">
            <input
              ref="editCategoryImageInput"
              type="file"
              accept="image/*"
              @change="handleEditImageChange"
              class="hidden"
            />
            <div @click="editCategoryImageInput?.click()" class="cursor-pointer">
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