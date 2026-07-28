<script setup>
import Cards from "~/components/common/Cards.vue";
import PageHeading from "~/components/common/PageHeading.vue";

definePageMeta({
  layout: "admin",
});

const RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "last6months", label: "Last 6 Months" },
  { value: "year", label: "This Year" },
];

const selectedRange = ref("last6months");

const {
  data: summary,
  pending: loading,
  error,
} = await useApiFetch("/api/dashboard/summary", {
  key: "admin-dashboard-summary",
  query: computed(() => ({ range: selectedRange.value })),
  watch: [selectedRange],
});

const revenueChartTitle = computed(() => {
  const option = RANGE_OPTIONS.find((o) => o.value === selectedRange.value);
  return `Revenue — ${option?.label || "Last 6 Months"}`;
});

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const stats = computed(() => {
  if (!summary.value) return [];
  return [
    { label: "Total Orders", value: summary.value.totalOrders, icon: "cart" },
    { label: "Total Revenue", value: formatCurrency(summary.value.totalRevenue), icon: "wallet" },
    { label: "Total Customers", value: summary.value.totalCustomers, icon: "users" },
    { label: "Products", value: summary.value.totalProducts, icon: "box" },
  ];
});

const maxRevenue = computed(() => {
  if (!summary.value?.revenueByPeriod?.length) return 0;
  return Math.max(...summary.value.revenueByPeriod.map((p) => p.revenue), 1);
});

// Hourly/daily ranges pack many more bars in, so labels are dropped in favor
// of the hover tooltip to avoid the x-axis turning into unreadable clutter.
const showBarLabels = computed(() => (summary.value?.revenueByPeriod?.length || 0) <= 12);

function paymentBadgeClass(status) {
  return status === "Paid" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700";
}

function fulfillmentBadgeClass(status) {
  switch (status) {
    case "Shipped":
      return "bg-blue-50 text-blue-700";
    case "Delivered":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-orange-50 text-orange-700";
  }
}
</script>

<template>
  <NuxtLayout name="admin">
    <div>
      <PageHeading heading="Dashboard" description="A snapshot of orders, revenue, and stock health." />

      <div v-if="loading" class="text-gray-500 px-4">Loading dashboard...</div>
      <div v-else-if="error" class="text-red-600 px-4">{{ error }}</div>

      <template v-else-if="summary">
        <Cards :stats="stats" />

        <!-- Low stock alert -->
        <div
          v-if="summary.lowStockCount > 0 || summary.outOfStockCount > 0"
          class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4"
        >
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 flex-shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1 1 0 003 19.5h18a1 1 0 00.89-1.46L13.71 3.86a1 1 0 00-1.72 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class="text-sm font-medium text-amber-800">
              <span v-if="summary.outOfStockCount > 0">{{ summary.outOfStockCount }} product(s) out of stock. </span>
              <span v-if="summary.lowStockCount > 0">{{ summary.lowStockCount }} product(s) running low.</span>
            </p>
          </div>
          <NuxtLink
            to="/admin/inventory"
            class="rounded-md bg-amber-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-amber-700"
          >
            View Inventory
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <!-- Revenue chart -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:col-span-2">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h3 class="text-sm font-semibold text-gray-700">{{ revenueChartTitle }}</h3>

              <div class="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1">
                <button
                  v-for="option in RANGE_OPTIONS"
                  :key="option.value"
                  type="button"
                  class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                  :class="
                    selectedRange === option.value
                      ? 'bg-white text-[var(--theme-color)] shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  "
                  @click="selectedRange = option.value"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div v-if="summary.revenueByPeriod.length === 0" class="mt-8 py-10 text-center text-sm text-gray-400">
              No revenue data yet.
            </div>

            <div v-else class="mt-6 flex h-48 items-end gap-1 sm:gap-2">
              <div
                v-for="period in summary.revenueByPeriod"
                :key="period.key"
                class="group relative flex flex-1 flex-col items-center gap-2"
              >
                <div
                  class="absolute -top-9 hidden rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white group-hover:block whitespace-nowrap z-50"
                >
                  {{ period.label }} &middot; {{ formatCurrency(period.revenue) }} &middot; {{ period.orders }} order{{ period.orders === 1 ? "" : "s" }}
                </div>
                <div class="flex h-40 w-full items-end">
                  <div
                    class="w-full rounded-t-md bg-[var(--theme-color)] opacity-80 transition-opacity group-hover:opacity-100"
                    :style="`height: ${Math.max(4, (period.revenue / maxRevenue) * 100)}%`"
                  />
                </div>
                <span v-if="showBarLabels" class="text-xs font-medium text-gray-500">{{ period.label }}</span>
              </div>
            </div>
          </div>

          <!-- Inventory snapshot -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 class="text-sm font-semibold text-gray-700">Inventory Snapshot</h3>

            <div class="mt-5 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">In Stock</span>
                <span class="text-sm font-semibold text-emerald-600">
                  {{ summary.totalProducts - summary.lowStockCount - summary.outOfStockCount }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Low Stock</span>
                <span class="text-sm font-semibold text-amber-600">{{ summary.lowStockCount }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Out of Stock</span>
                <span class="text-sm font-semibold text-red-600">{{ summary.outOfStockCount }}</span>
              </div>
            </div>

            <NuxtLink
              to="/admin/inventory"
              class="mt-6 block w-full rounded-md border border-[var(--theme-color)] py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-[var(--theme-color)] hover:bg-themeSoft"
            >
              Manage Inventory
            </NuxtLink>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-700">Recent Orders</h3>
            <NuxtLink to="/admin/orders" class="text-xs font-semibold uppercase tracking-wider text-[var(--theme-color)]">
              View All
            </NuxtLink>
          </div>

          <div v-if="summary.recentOrders.length === 0" class="py-8 text-center text-sm text-gray-400">
            No orders yet.
          </div>

          <table v-else class="w-full">
            <thead>
              <tr class="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-400">
                <th class="pb-3">Order</th>
                <th class="pb-3">Customer</th>
                <th class="pb-3">Items</th>
                <th class="pb-3">Total</th>
                <th class="pb-3">Payment</th>
                <th class="pb-3">Fulfillment</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in summary.recentOrders"
                :key="order.id"
                class="cursor-pointer border-b border-gray-50 last:border-0 hover:bg-gray-50"
                @click="navigateTo(`/admin/order/${order.id}`)"
              >
                <td class="py-3 text-sm font-medium text-purple-700">#BS-{{ order.id }}</td>
                <td class="py-3 text-sm">
                  <p class="text-gray-800">{{ order.customerName }}</p>
                  <p v-if="order.customerEmail" class="text-xs text-gray-400">{{ order.customerEmail }}</p>
                </td>
                <td class="py-3 text-sm text-gray-500">{{ order.itemCount }} item(s)</td>
                <td class="py-3 text-sm font-semibold text-gray-800">{{ formatCurrency(order.total) }}</td>
                <td class="py-3">
                  <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" :class="paymentBadgeClass(order.paymentStatus)">
                    {{ order.paymentStatus }}
                  </span>
                </td>
                <td class="py-3">
                  <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" :class="fulfillmentBadgeClass(order.fulfillmentStatus)">
                    {{ order.fulfillmentStatus }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </NuxtLayout>
</template>
