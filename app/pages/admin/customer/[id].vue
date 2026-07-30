<script setup>
import InventoryCard from "~/modules/orders/cards/InventoryCard.vue";

definePageMeta({
  layout: "admin",
});

const route = useRoute();

const {
  data: customer,
  pending: loading,
  error,
} = await useApiFetch(`/api/customers/${route.params.id}`);

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timeAgo(value) {
  if (!value) return "No purchases yet";
  const days = Math.floor((Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

const orderFrequency = computed(() => {
  if (!customer.value) return "—";
  const { orderCount } = customer.value.stats;
  if (!orderCount) return "No orders yet";
  const joinedDays = Math.max(1, (Date.now() - new Date(customer.value.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const perYear = orderCount / (joinedDays / 365);
  return `${perYear.toFixed(1)} / Year`;
});

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
    <CommonBreadcrumbs
      class="px-4 pt-4"
      :items="[
        { label: 'Customers', to: '/admin/customers' },
        { label: customer?.name || `Customer #${route.params.id}` },
      ]"
    />

    <div v-if="loading" class="p-4 text-gray-500">Loading customer...</div>
    <div v-else-if="error" class="p-4 text-red-600">{{ error }}</div>

    <div v-else-if="customer">
      <div class="flex flex-col gap-4 p-4 md:flex-row md:items-stretch">
        <!-- Client Insights Card -->
        <div
          class="flex flex-1 flex-col rounded-2xl bg-gradient-to-br from-purple-800 to-purple-900 p-5 text-white shadow-lg md:min-h-[300px]"
        >
          <h3 class="text-sm font-semibold text-purple-200">Client Insights</h3>

          <p class="mt-4 text-[11px] font-medium uppercase tracking-wide text-purple-300">
            Total Lifetime Spent
          </p>
          <p class="mt-1 text-2xl font-bold">
            {{ formatCurrency(customer.stats.totalLifetimeSpent) }}
          </p>

          <div class="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p class="text-[11px] font-medium uppercase tracking-wide text-purple-300">
                Order Frequency
              </p>
              <p class="mt-1 text-sm font-semibold">{{ orderFrequency }}</p>
            </div>

            <div>
              <p class="text-[11px] font-medium uppercase tracking-wide text-purple-300">
                Last Purchase
              </p>
              <p class="mt-1 text-sm font-semibold">{{ timeAgo(customer.stats.lastPurchaseDate) }}</p>
            </div>
          </div>

          <div class="mt-auto border-t border-purple-600/50 pt-4">
            <p class="text-[11px] font-medium uppercase tracking-wide text-purple-300">
              Preferred Category
            </p>

            <div class="mt-2 flex items-center gap-2 rounded-lg bg-purple-950/40 px-3 py-2">
              <svg class="h-4 w-4 flex-shrink-0 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.5 5.5L20 9l-4.5 4 1.5 6-5-3.5L7 19l1.5-6L4 9l5.5-1.5z" />
              </svg>

              <span class="text-sm font-medium">
                {{ customer.stats.preferredCategory || "No purchases yet" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Contact Details Card -->
        <div class="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:min-h-[300px]">
          <h3 class="text-sm font-semibold text-gray-500">Contact Details</h3>

          <div class="mt-4 space-y-4">
            <div class="flex items-start gap-3">
              <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-700">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400">Email Address</p>
                <p class="mt-0.5 break-all text-sm font-medium text-gray-800">{{ customer.email }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-700">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M3 5a2 2 0 012-2h2.28a1 1 0 01.98.8l.72 3.6a1 1 0 01-.5 1.1l-1.5.86a12 12 0 006 6l.86-1.5a1 1 0 011.1-.5l3.6.72a1 1 0 01.8.98V19a2 2 0 01-2 2h-1C9.4 21 3 14.6 3 6V5z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400">Phone Number</p>
                <p class="mt-0.5 text-sm font-medium text-gray-800">{{ customer.phone || "—" }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-700">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>

              <div>
                <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400">Primary Address</p>
                <p class="mt-0.5 whitespace-pre-line text-sm font-medium text-gray-800">
                  {{ [customer.street, customer.city].filter(Boolean).join(", ") || "—" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Purchase History -->
      <div class="px-4 pb-6">
        <h2 class="mb-3 text-lg font-semibold text-gray-800">
          Purchase History
          <span class="ml-2 text-sm font-normal text-gray-400">({{ customer.orders.length }} order{{ customer.orders.length === 1 ? "" : "s" }})</span>
        </h2>

        <div v-if="customer.orders.length === 0" class="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          This customer hasn't placed any orders yet.
        </div>

        <div v-else class="space-y-5">
          <div
            v-for="order in customer.orders"
            :key="order.id"
            class="rounded-xl border border-gray-200 bg-white overflow-hidden"
          >
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3">
              <div class="flex items-center gap-3">
                <NuxtLink :to="`/admin/order/${order.id}`" class="font-semibold text-theme hover:underline">
                  #BS-{{ order.id }}
                </NuxtLink>
                <span class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</span>
              </div>

              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="paymentBadgeClass(order.paymentStatus)">
                  {{ order.paymentStatus }}
                </span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="fulfillmentBadgeClass(order.fulfillmentStatus)">
                  {{ order.fulfillmentStatus }}
                </span>
              </div>
            </div>

            <InventoryCard
              :items="order.items"
              :subtotal="order.subtotal"
              :gst="order.gst"
              :total="order.total"
            />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
