<script setup>
import PageHeading from "~/components/common/PageHeading.vue";

definePageMeta({
  layout: "admin",
});

const {
  data: products,
  pending: loading,
  error,
} = await useApiFetch("/api/inventory/todays-arrivals", {
  default: () => [],
});

if (error.value) {
  console.error("Error fetching today's arrivals:", error.value);
}

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
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

const tableColumns = [
  { key: "product", label: "Product" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "status", label: "Status" },
  { key: "addedAt", label: "Added" },
];

const search = ref("");

const rows = computed(() => {
  const mapped = (products.value || []).map((p) => ({
    id: p.id,
    name: p.name,
    color: p.color,
    image: p.image,
    category: p.category?.name || "—",
    price: formatCurrency(p.price),
    stock: p.stock,
    status: p.status,
    addedAt: formatTime(p.createdAt),
  }));

  const query = search.value.trim().toLowerCase();
  if (!query) return mapped;

  return mapped.filter(
    (row) => row.name?.toLowerCase().includes(query) || row.category?.toLowerCase().includes(query)
  );
});
</script>

<template>
  <NuxtLayout name="admin">
    <div class="tw-px-5">
      <CommonBreadcrumbs
        :items="[
          { label: 'Inventory', to: '/admin/inventory' },
          { label: `Recently Added` },
        ]"
      />

      <PageHeading heading="Recently Added" description="Products added to your inventory today." />

      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div v-if="loading" class="text-gray-500 py-8 text-center">Loading today's arrivals...</div>
        <div v-else-if="error" class="text-red-600 py-8 text-center">{{ error }}</div>
        <template v-else>
          <div v-if="(products || []).length > 0" class="mb-5 flex justify-end">
            <input
              v-model="search"
              type="text"
              placeholder="Search by product or category..."
              class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--theme-color)]"
            />
          </div>

          <div v-if="(products || []).length === 0" class="text-gray-500 py-8 text-center">
            No products have been added today.
          </div>
          <div v-else-if="rows.length === 0" class="text-gray-500 py-8 text-center">
            No products match your search.
          </div>

          <CommonTable v-else :columns="tableColumns" :data="rows">
          <template #cell-product="{ row }">
            <div class="flex items-center gap-3">
              <img
                :src="row.image || NO_IMAGE_PLACEHOLDER"
                class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                @error="(e) => (e.target.src = NO_IMAGE_PLACEHOLDER)"
              />
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ row.name }}</p>
                <p v-if="row.color" class="text-xs text-gray-500">{{ row.color }}</p>
              </div>
            </div>
          </template>

          <template #cell-price="{ row }">
            <span class="font-medium text-gray-800">{{ row.price }}</span>
          </template>

          <template #cell-status="{ row }">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="statusBadge(row.status).class"
            >
              {{ statusBadge(row.status).label }}
            </span>
          </template>
          </CommonTable>
        </template>
      </div>
    </div>
  </NuxtLayout>
</template>
