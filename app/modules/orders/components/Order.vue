<script setup>
import PageHeading from "~/components/common/PageHeading.vue";
const router = useRouter();

function openOrder(row) {
  router.push(`/admin/order/${row.id}`);
}

const page = ref(1);

const { data: ordersPage, pending: loading, error: ordersError } = await useApiFetch("/api/orders", {
  query: computed(() => ({ page: page.value, limit: 10 })),
  watch: [page],
  default: () => ({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } }),
});

if (ordersError.value) {
  console.error("Error fetching orders:", ordersError.value);
}

const orders = computed(() => ordersPage.value?.data || []);
const pageMeta = computed(() => ordersPage.value?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });

const tableColumns = [
  { key: "orderId", label: "Order ID", width: "100px" },
  { key: "date", label: "Date", width: "100px" },
  { key: "customer", label: "Customer" },
  { key: "items", label: "Items" },
  { key: "total", label: "Total" },
  { key: "payment", label: "Payment" },
  { key: "fulfillment", label: "Fulfillment" },
];

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initialsOf(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const transactions = computed(() =>
  orders.value.map((order) => ({
    id: order.id,
    orderId: `#BS-${order.id}`,
    date: formatDate(order.createdAt),
    customerInitials: initialsOf(order.customer?.name),
    customerName: order.customer?.name || "Unknown",
    items: `${order.items?.length || 0} item(s)`,
    total: `Rs ${Number(order.total).toLocaleString("en-IN")}`,
    payment: order.paymentStatus,
    fulfillment: order.fulfillmentStatus,
  }))
);

// Badge color helpers
function paymentBadgeClass(status) {
  return status === "Paid"
    ? "bg-green-50 text-green-700"
    : "bg-orange-50 text-orange-700";
}

function fulfillmentBadgeClass(status) {
  switch (status) {
    case "Shipped":
      return "bg-blue-50 text-blue-700";
    case "Delivered":
      return "bg-gray-100 text-gray-600";
    case "Processing":
    default:
      return "bg-orange-50 text-orange-700";
  }
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
</script>

<template>
  <div class="tw-px-5">
    <PageHeading
      heading="Order Management"
      description="Inventory & Sales Dashboard — Oct 2023"
    />

    <!-- Active Transactions -->
    <div class="bg-white rounded-xl border border-gray-200 p-5 custom-scrollbar  overflow-x-auto">
      
      <div v-if="loading" class="text-gray-500 py-8 text-center">Loading orders...</div>
      <CommonTable
        v-else
        :columns="tableColumns"
        :data="transactions"
        pagination
        :page="pageMeta.page"
        :total-pages="pageMeta.totalPages"
        :total="pageMeta.total"
        :limit="pageMeta.limit"
        @row-click="openOrder"
        @page-change="page = $event"
      >
        <template #cell-orderId="{ row }">
          <span class="text-purple-700 font-medium">{{ row.orderId }}</span>
        </template>

        <template #cell-customer="{ row }">
          <div class="flex items-center gap-2">
            <span
              class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
              :class="avatarColor(row.customerInitials)"
            >
              {{ row.customerInitials }}
            </span>
            <span class="text-gray-800">{{ row.customerName }}</span>
          </div>
        </template>

        <template #cell-total="{ row }">
          <span class="text-purple-700 font-semibold">{{ row.total }}</span>
        </template>

        <template #cell-payment="{ row }">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            :class="paymentBadgeClass(row.payment)"
          >
            {{ row.payment }}
          </span>
        </template>

        <template #cell-fulfillment="{ row }">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            :class="fulfillmentBadgeClass(row.fulfillment)"
          >
            {{ row.fulfillment }}
          </span>
        </template>
      </CommonTable>

     
    </div>
  </div>
</template>