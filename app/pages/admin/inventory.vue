<script setup>
import { ref, computed } from "vue";
import Cards from "~/components/common/Cards.vue";
import PageHeading from "~/components/common/PageHeading.vue";

definePageMeta({
  layout: "admin",
});

const toasts = useState("app-toasts", () => []);
const addToast = (message, type = "success", duration = 3000) => {
  const toast = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, message, type, duration };
  toasts.value = [...toasts.value, toast];
  if (duration > 0) {
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toast.id);
    }, duration);
  }
};

const page = ref(1);
const statusFilter = ref("all");
const search = ref("");
const showEditModal = ref(false);
const editForm = ref({ id: null, name: "", stock: 0, lowStockThreshold: 5 });
const savingId = ref(null);

const filters = [
  { id: "all", label: "All" },
  { id: "in", label: "In Stock" },
  { id: "low", label: "Low Stock" },
  { id: "out", label: "Out of Stock" },
];

watch([statusFilter, search], () => {
  page.value = 1;
});

const {
  data: productsPage,
  pending: loading,
  error,
  refresh,
} = await useApiFetch("/api/inventory", {
  query: computed(() => ({
    page: page.value,
    limit: 10,
    status: statusFilter.value,
    ...(search.value.trim() ? { search: search.value.trim() } : {}),
  })),
  default: () => ({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } }),
  watch: [page, statusFilter, search],
});

const products = computed(() => productsPage.value?.data || []);
const pageMeta = computed(() => productsPage.value?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });

const {
  data: summary,
  refresh: refreshSummary,
} = await useApiFetch("/api/inventory/summary");

const stats = computed(() => {
  if (!summary.value) return [];
  return [
    { label: "Total Products", value: summary.value.totalProducts, icon: "box" },
    { label: "Total Units", value: summary.value.totalUnits, icon: "cart" },
    { label: "Low Stock", value: summary.value.lowStockCount, icon: "alert", noteColor: "text-amber-500" },
    { label: "Out of Stock", value: summary.value.outOfStockCount, icon: "alert", noteColor: "text-red-500" },
  ];
});

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function statusBadge(status) {
  switch (status) {
    case "out":
      return { label: "Out of Stock", class: "bg-red-50 text-red-700" };
    case "low":
      return { label: "Low Stock", class: "bg-amber-50 text-amber-700" };
    default:
      return { label: "In Stock", class: "bg-emerald-50 text-emerald-700" };
  }
}

async function adjustStock(product, delta) {
  if (product.stock + delta < 0) return;
  savingId.value = product.id;
  try {
    await apiFetch(`/api/inventory/${product.id}`, {
      method: "PATCH",
      body: { delta },
    });
    await Promise.all([refresh(), refreshSummary()]);
  } catch (err) {
    addToast(err?.data?.error || "Unable to update stock", "error");
  } finally {
    savingId.value = null;
  }
}

function openEditModal(product) {
  editForm.value = { id: product.id, name: product.name, stock: product.stock, lowStockThreshold: product.lowStockThreshold };
  showEditModal.value = true;
}

async function handleSaveEdit() {
  if (editForm.value.stock < 0 || editForm.value.lowStockThreshold < 0) {
    addToast("Values cannot be negative", "error");
    return;
  }
  try {
    await apiFetch(`/api/inventory/${editForm.value.id}`, {
      method: "PATCH",
      body: { stock: editForm.value.stock, lowStockThreshold: editForm.value.lowStockThreshold },
    });
    showEditModal.value = false;
    addToast("Inventory updated", "success");
    await Promise.all([refresh(), refreshSummary()]);
  } catch (err) {
    addToast(err?.data?.error || "Unable to update inventory", "error");
  }
}

const tableColumns = [
  { key: "product", label: "Product" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", width: "100px" },
];
</script>

<template>
  <NuxtLayout name="admin">
    <div class="tw-px-5">
      <PageHeading heading="Inventory" description="Track stock levels and keep your collection replenished." />

      <Cards :stats="stats" />

      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div class="flex gap-2">
            <button
              v-for="f in filters"
              :key="f.id"
              @click="statusFilter = f.id"
              :class="[
                'px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition',
                statusFilter === f.id
                  ? 'bg-[var(--theme-color)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
            >
              {{ f.label }}
            </button>
          </div>

          <input
            v-model="search"
            type="text"
            placeholder="Search by product or category..."
            class="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--theme-color)]"
          />
        </div>

        <div v-if="loading" class="text-gray-500 py-8 text-center">Loading inventory...</div>
        <div v-else-if="error" class="text-red-600 py-8 text-center">{{ error }}</div>

        <CommonTable
          v-else
          :columns="tableColumns"
          :data="products"
          pagination
          :page="pageMeta.page"
          :total-pages="pageMeta.totalPages"
          :total="pageMeta.total"
          :limit="pageMeta.limit"
          @page-change="page = $event"
        >
          <template #cell-product="{ row }">
            <div class="flex items-center gap-3">
              <img
                :src="row.image || NO_IMAGE_PLACEHOLDER"
                class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                @error="(e) => e.target.src = NO_IMAGE_PLACEHOLDER"
              />
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ row.name }}</p>
                <p v-if="row.color" class="text-xs text-gray-500">{{ row.color }}</p>
              </div>
            </div>
          </template>

          <template #cell-category="{ row }">
            {{ row.category?.name || "—" }}
          </template>

          <template #cell-price="{ row }">
            <span class="font-medium text-gray-800">{{ formatCurrency(row.price) }}</span>
          </template>

          <template #cell-stock="{ row }">
            <div class="flex items-center gap-2">
              <button
                :disabled="savingId === row.id || row.stock <= 0"
                @click="adjustStock(row, -1)"
                class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span class="w-8 text-center text-sm font-semibold text-gray-800">{{ row.stock }}</span>
              <button
                :disabled="savingId === row.id"
                @click="adjustStock(row, 1)"
                class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </template>

          <template #cell-status="{ row }">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="statusBadge(row.status).class"
            >
              {{ statusBadge(row.status).label }}
            </span>
          </template>

          <template #cell-actions="{ row }">
            <button
              @click="openEditModal(row)"
              class="px-3 py-1.5 rounded-md border border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600 hover:border-[var(--theme-color)] hover:text-[var(--theme-color)]"
            >
              Edit
            </button>
          </template>
        </CommonTable>
      </div>
    </div>

    <CommonDrawer :show="showEditModal" title="Edit Inventory" @close="showEditModal = false" @confirm="handleSaveEdit">
      <form @submit.prevent="handleSaveEdit" class="space-y-4">
        <p class="text-sm font-medium text-gray-700">{{ editForm.name }}</p>

        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Stock Quantity</label>
          <input
            v-model.number="editForm.stock"
            type="number"
            min="0"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Low Stock Threshold</label>
          <input
            v-model.number="editForm.lowStockThreshold"
            type="number"
            min="0"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Product is flagged "Low Stock" when quantity drops to this number or below.</p>
        </div>
      </form>
    </CommonDrawer>
  </NuxtLayout>
</template>
