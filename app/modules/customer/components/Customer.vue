<script setup>
import Cards from "~/components/common/Cards.vue";
import PageHeading from "~/components/common/PageHeading.vue";
const router = useRouter();

function openOrder(row) {
  router.push(`/admin/customer/${row.id}`);
}

const tableColumns = [
  { key: "customer", label: "Customer" },
  { key: "phone", label: "Phone" },
  { key: "city", label: "City" },
  { key: "orders", label: "Orders" },
  { key: "spent", label: "Total Spent" },
];

const page = ref(1);
const search = ref("");

watch(search, () => {
  page.value = 1;
});

const {
  data: customersPage,
  pending: loading,
  error,
} = await useApiFetch("/api/customers", {
  query: computed(() => ({
    page: page.value,
    limit: 10,
    ...(search.value.trim() ? { search: search.value.trim() } : {}),
  })),
  watch: [page, search],
  default: () => ({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } }),
});

const customers = computed(() => customersPage.value?.data || []);
const pageMeta = computed(() => customersPage.value?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });

// Site-wide totals, independent of which page of customers is currently shown.
const { data: summary } = await useApiFetch("/api/dashboard/summary", { key: "admin-customers-dashboard-summary" });

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

const stats = computed(() => {
  if (!summary.value) return [];
  const avgOrderValue = summary.value.totalOrders > 0 ? summary.value.totalRevenue / summary.value.totalOrders : 0;

  return [
    { label: "Total Customers", value: summary.value.totalCustomers, icon: "users" },
    { label: "Total Orders", value: summary.value.totalOrders, icon: "cart" },
    { label: "Total Revenue", value: formatCurrency(summary.value.totalRevenue), icon: "wallet" },
    { label: "Avg. Order Value", value: formatCurrency(avgOrderValue), icon: "chart" },
  ];
});
</script>

<template>
  <div class="tw-px-5">
    <PageHeading
       heading="Customer Management"
      description="Oversee your elite clientele and membership tiers."
    />

<div>
<Cards :stats="stats"/></div>

    <!-- Customers -->
    <div class="bg-white rounded-xl border border-gray-200 p-5 custom-scrollbar overflow-x-auto">
      <div class="mb-5 flex justify-end">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name, email, phone, or city..."
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--theme-color)]"
        />
      </div>

      <div v-if="loading" class="text-gray-500">Loading customers...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <CommonTable
        v-else
        :columns="tableColumns"
        :data="customers"
        pagination
        :page="pageMeta.page"
        :total-pages="pageMeta.totalPages"
        :total="pageMeta.total"
        :limit="pageMeta.limit"
        @row-click="openOrder"
        @page-change="page = $event"
      >
        <template #cell-customer="{ row }">
          <div class="flex items-center gap-3">
            <img
              v-if="row.picture"
              :src="row.picture"
              :alt="row.name"
              class="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold shrink-0"
            >
              {{ row.name?.trim()?.charAt(0)?.toUpperCase() || "?" }}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">
                {{ row.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ row.email }}
              </p>
            </div>
          </div>
        </template>

        <template #cell-phone="{ row }">
          {{ row.phone }}
        </template>

        <template #cell-city="{ row }">
          {{ row.city }}
        </template>

        <template #cell-orders="{ row }">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
            {{ row.orderCount || 0 }}
          </span>
        </template>

        <template #cell-spent="{ row }">
          <span class="font-semibold text-gray-800">{{ formatCurrency(row.totalSpent) }}</span>
        </template>
      </CommonTable>
    </div>
  </div>
</template>