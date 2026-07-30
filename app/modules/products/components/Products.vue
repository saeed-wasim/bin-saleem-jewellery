<script setup>
import { ref } from "vue";
import EditIcon from "~/assets/icons/edit.vue";
import DeleteIcon from "~/assets/icons/delete.vue";
import PageHeading from "~/components/common/PageHeading.vue";
import Categories from "./tabs/categories/Categories.vue";
import Items from "./tabs/items/Items.vue";
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
const activeTab = ref("categories");
const showCategoryModal = ref(false);
const showItemModal = ref(false);
const itemForm = ref({ name: "", description: "", price: "", categoryId: "", image: null, color: "", variantGroupId: "", length: "", width: "", stock: "", isGiftGuide: false });
const categoryForm = ref({ name: "", description: "", image: null });
const categoryImagePreview = ref(null);
const itemImagePreview = ref(null);
const isLoading = ref(false);
const categoriesRef = ref(null);
const itemsRef = ref(null);
const categoriesRefreshTrigger = ref(0);

const { data: categoriesList, error: categoriesError, refresh: refreshCategories } = await useApiFetch("/api/categories", {
  default: () => [],
  watch: [categoriesRefreshTrigger],
});

// Log for debugging
if (categoriesError) {
  console.error('Error fetching categories:', categoriesError);
} else {
  console.log('Categories loaded:', categoriesList.value);
}

const tabs = [
  { id: "categories", label: "Categories", component: Categories },
  { id: "items", label: "Items", component: Items },
];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function openCreateCategoryModal() {
  categoryForm.value = { name: "", description: "", image: null };
  categoryImagePreview.value = null;
  showCategoryModal.value = true;
}

async function handleCategoryImageChange(event) {
  const file = event.target.files[0];
  if (!file) {
    categoryForm.value.image = null;
    categoryImagePreview.value = null;
    return;
  }
  categoryImagePreview.value = await readFileAsDataUrl(file);
  categoryForm.value.image = file;
}

async function openCreateItemModal() {
  itemForm.value = { name: "", description: "", price: "", categoryId: "", image: null, color: "", variantGroupId: "", length: "", width: "", stock: "", isGiftGuide: false };
  itemImagePreview.value = null;
  refreshCategories();
  showItemModal.value = true;
}

async function handleItemImageChange(event) {
  const file = event.target.files[0];
  if (!file) {
    itemForm.value.image = null;
    itemImagePreview.value = null;
    return;
  }
  itemImagePreview.value = await readFileAsDataUrl(file);
  itemForm.value.image = file;
}

async function handleCreateCategory() {
  if (!categoryForm.value.name || !categoryForm.value.description) {
    addToast("Name and description are required", "error");
    return;
  }
  
  if (!categoryForm.value.image) {
    addToast("Image is required", "error");
    return;
  }

  try {
    isLoading.value = true;

    await apiFetch("/api/categories", {
      method: "POST",
      body: {
        name: categoryForm.value.name,
        description: categoryForm.value.description,
        image: categoryImagePreview.value,
      },
    });
    showCategoryModal.value = false;
    categoryForm.value = { name: "", description: "", image: null };
    categoryImagePreview.value = null;
    addToast("Category created successfully", "success");
    
    // Refresh categories list
    categoriesRefreshTrigger.value++;
    await refreshCategories();
    if (categoriesRef.value?.refresh) {
      await categoriesRef.value.refresh();
      if (categoriesRef.value?.refreshTrigger) {
        categoriesRef.value.refreshTrigger.value++;
      }
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

async function handleCreateItem() {
  if (!itemForm.value.name || !itemForm.value.description || !itemForm.value.price || !itemForm.value.categoryId || itemForm.value.stock === "") {
    addToast("Name, description, price, stock quantity, and category are required", "error");
    return;
  }
  
  if (!itemForm.value.image) {
    addToast("Image is required", "error");
    return;
  }

  try {
    isLoading.value = true;

    await apiFetch("/api/products", {
      method: "POST",
      body: {
        name: itemForm.value.name,
        description: itemForm.value.description,
        price: itemForm.value.price,
        categoryId: itemForm.value.categoryId,
        image: itemImagePreview.value,
        color: itemForm.value.color,
        variantGroupId: itemForm.value.variantGroupId,
        length: itemForm.value.length,
        width: itemForm.value.width,
        stock: itemForm.value.stock,
        isGiftGuide: itemForm.value.isGiftGuide,
      },
    });
    showItemModal.value = false;
    itemForm.value = { name: "", description: "", price: "", categoryId: "", image: null, color: "", variantGroupId: "", length: "", width: "", stock: "", isGiftGuide: false };
    itemImagePreview.value = null;
    addToast("Item created successfully", "success");
    
    // Refresh items list
    if (itemsRef.value?.refresh) {
      await itemsRef.value.refresh();
      if (itemsRef.value?.refreshTrigger) {
        itemsRef.value.refreshTrigger.value++;
      }
    }
  } catch (error) {
    addToast(
      error?.data?.statusMessage || "Unable to create item",
      "error",
    );
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="tw-px-5">

    <PageHeading
      heading="Products Management"
      description="Create and manage your luxury jewelry inventory."
    >
      <template #actions>
        <button
          v-if="activeTab === 'items'"
          @click="categoriesList.length > 0 ? openCreateItemModal() : addToast('Please create a category first', 'error')"
          :class="[
            'px-5 py-2.5 rounded-md uppercase text-xs font-semibold tracking-wider transition',
            categoriesList.length > 0 
              ? 'bg-[var(--theme-color)] text-white hover:opacity-90' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
          :disabled="categoriesList.length === 0"
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
      <Items v-else-if="activeTab === 'items'" ref="itemsRef" />
      <component v-else :is="tabs.find((t) => t.id === activeTab)?.component" />
    </div>

    <!-- Create Category Modal -->
    <CommonDrawer
      :show="showCategoryModal"
      title="Add New Category"
      @close="showCategoryModal = false"
      @confirm="handleCreateCategory"
    >
      <form @submit.prevent="handleCreateCategory" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Category Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="categoryForm.name"
            type="text"
            placeholder="Enter name"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Description <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="categoryForm.description"
            placeholder="Detail the materials, carat weight, and design inspiration..."
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            rows="4"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Category Image <span class="text-red-500">*</span>
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--theme-color)] transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              @change="handleCategoryImageChange"
              class="hidden"
              id="category-image"
            />
            <label for="category-image" class="cursor-pointer">
              <div v-if="!categoryImagePreview" class="text-gray-500">
                <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm">Click to upload image</p>
              </div>
              <div v-else class="relative inline-block w-full">
                <img 
                  :src="categoryImagePreview" 
                  alt="Preview" 
                  class="w-full h-auto object-cover rounded-lg"
                />
                <div class="absolute top-2 right-2">
                  <button
                    type="button"
                    @click.prevent="categoryForm.image = null; categoryImagePreview = null"
                    class="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                    title="Remove image"
                  >
                    <DeleteIcon />
                  </button>
                </div>
                <p v-if="categoryForm.image" class="text-sm font-medium mt-2">{{ categoryForm.image.name }}</p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </CommonDrawer>

    <!-- Create Item Modal -->
    <CommonDrawer
      :show="showItemModal"
      title="Add New Item"
      @close="showItemModal = false"
      @confirm="handleCreateItem"
    >
      <form @submit.prevent="handleCreateItem" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Item Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="itemForm.name"
            type="text"
            placeholder="Enter item name"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Description <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="itemForm.description"
            placeholder="Detail the materials, carat weight, and design inspiration..."
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            rows="4"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Price <span class="text-red-500">*</span>
          </label>
          <input
            v-model="itemForm.price"
            type="number"
            placeholder="Enter price"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Stock Quantity <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="itemForm.stock"
            type="number"
            min="0"
            placeholder="Enter stock quantity"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Category <span class="text-red-500">*</span>
          </label>
          <select
            v-model="itemForm.categoryId"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            required
            :disabled="categoriesList.length === 0"
          >
            <option value="">Select category</option>
            <option v-for="category in categoriesList" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <p v-if="categoriesList.length === 0" class="text-red-500 text-xs mt-1">
            No categories available. Please create a category first in the Categories tab.
          </p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Color
          </label>
          <input
            v-model="itemForm.color"
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
            v-model="itemForm.variantGroupId"
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
              v-model="itemForm.length"
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
              v-model="itemForm.width"
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
              v-model="itemForm.isGiftGuide"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-[var(--theme-color)] focus:ring-[var(--theme-color)]"
            />
            Show in Gift Guide
          </label>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Item Image <span class="text-red-500">*</span>
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--theme-color)] transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              @change="handleItemImageChange"
              class="hidden"
              id="item-image"
            />
            <label for="item-image" class="cursor-pointer">
              <div v-if="!itemImagePreview" class="text-gray-500">
                <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm">Click to upload image</p>
              </div>
              <div v-else class="relative inline-block w-full">
                <img 
                  :src="itemImagePreview" 
                  alt="Preview" 
                  class="w-full h-auto object-cover rounded-lg"
                />
                <div class="absolute top-2 right-2">
                  <button
                    type="button"
                    @click.prevent="itemForm.image = null; itemImagePreview = null"
                    class="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                    title="Remove image"
                  >
                    <DeleteIcon />
                  </button>
                </div>
                <p v-if="itemForm.image" class="text-sm font-medium mt-2">{{ itemForm.image.name }}</p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </CommonDrawer>
  </div>
</template>
