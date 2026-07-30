<script setup>
import PageHeading from "~/components/common/PageHeading.vue";

definePageMeta({
  layout: "admin",
});

const page = ref(1);
const search = ref("");

watch(search, () => {
  page.value = 1;
});

const { data: ordersPage, pending: loading, error: ordersError } = await useApiFetch("/api/orders", {
  key: "admin-payments-list",
  query: computed(() => ({
    page: page.value,
    limit: 10,
    ...(search.value.trim() ? { search: search.value.trim() } : {}),
  })),
  watch: [page, search],
  default: () => ({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } }),
});

if (ordersError.value) {
  console.error("Error fetching payments:", ordersError.value);
}

const orders = computed(() => ordersPage.value?.data || []);
const pageMeta = computed(() => ordersPage.value?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });

const totalRevenue = computed(() => Number(ordersPage.value?.totalRevenue || 0));
const pageRevenue = computed(() =>
  orders.value.filter((o) => o.paymentStatus === "Paid").reduce((sum, o) => sum + Number(o.total), 0)
);

function formatPrice(value) {
  return `Rs ${Number(value).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initialsOf(name) {
  const trimmed = (name || "").trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

function avatarColor(initials) {
  const colors = [
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-blue-100 text-blue-700",
    "bg-red-100 text-red-700",
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
}

function paymentBadgeClass(status) {
  return status === "Paid" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700";
}

const tableColumns = [
  { key: "orderId", label: "Order ID", width: "100px" },
  { key: "date", label: "Date", width: "110px" },
  { key: "customer", label: "Customer" },
  { key: "method", label: "Method" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

const rows = computed(() =>
  orders.value.map((order) => ({
    id: order.id,
    orderId: `#BS-${order.id}`,
    date: formatDate(order.createdAt),
    customerInitials: initialsOf(order.customer?.name),
    customerPicture: order.customer?.picture || null,
    customerName: order.customer?.name || "Unknown",
    customerEmail: order.customer?.email || "",
    method: order.paymentMethod || "—",
    amount: formatPrice(order.total),
    status: order.paymentStatus,
  }))
);
</script>

<template>
  <NuxtLayout name="admin">
    <div class="tw-px-5">
      <PageHeading heading="Payments" description="Track transactions and payment status across all orders" />

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="rounded-xl bg-gradient-to-r from-theme to-purple-700 text-white p-5 shadow-lg">
          <p class="text-sm text-white/80">Total Revenue</p>
          <p class="mt-1 text-2xl font-bold">{{ formatPrice(totalRevenue) }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-sm text-gray-500">Revenue (this page)</p>
          <p class="mt-1 text-2xl font-bold text-gray-900">{{ formatPrice(pageRevenue) }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-sm text-gray-500">Transactions</p>
          <p class="mt-1 text-2xl font-bold text-gray-900">{{ pageMeta.total }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-5 custom-scrollbar overflow-x-auto">
        <div class="mb-5 flex justify-end">
          <input
            v-model="search"
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--theme-color)]"
          />
        </div>

        <div v-if="loading" class="text-gray-500 py-8 text-center">Loading payments...</div>
        <CommonTable
          v-else
          :columns="tableColumns"
          :data="rows"
          pagination
          :page="pageMeta.page"
          :total-pages="pageMeta.totalPages"
          :total="pageMeta.total"
          :limit="pageMeta.limit"
          @page-change="page = $event"
        >
          <template #cell-orderId="{ row }">
            <span class="text-theme font-medium">{{ row.orderId }}</span>
          </template>

          <template #cell-customer="{ row }">
            <div class="flex items-center gap-2">
              <img
                v-if="row.customerPicture"
                :src="row.customerPicture"
                :alt="row.customerName"
                class="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <span
                v-else
                class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                :class="avatarColor(row.customerInitials)"
              >
                {{ row.customerInitials }}
              </span>
              <div class="min-w-0">
                <p class="text-gray-800 truncate">{{ row.customerName }}</p>
                <p v-if="row.customerEmail" class="text-xs text-gray-400 truncate">{{ row.customerEmail }}</p>
              </div>
            </div>
          </template>

          <template #cell-amount="{ row }">
            <span class="text-theme font-semibold">{{ row.amount }}</span>
          </template>

          <template #cell-status="{ row }">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="paymentBadgeClass(row.status)"
            >
              {{ row.status }}
            </span>
          </template>
        </CommonTable>
      </div>
    </div>
  </NuxtLayout>
</template>
