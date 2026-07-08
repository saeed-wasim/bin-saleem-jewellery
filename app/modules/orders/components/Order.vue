<script setup>
import PageHeading from "~/components/common/PageHeading.vue";
const router = useRouter();

function openOrder(row) {
  router.push(`/admin/order/${row.id}`);
}

// Static stats (replace API calls)
const stats = ref({
  totalOrders: 1248,
  totalOrdersChange: "12% from last month",
  pendingShipments: 42,
  pendingShipmentsNote: "Requires immediate attention",
  netRevenue: "$4.2M",
  netRevenueChange: "8.4% above target",
});

// Static table columns
const tableColumns = [
  { key: "orderId", label: "Order ID", width: "100px" },
  { key: "date", label: "Date", width: "100px" },
  { key: "customer", label: "Customer" },
  { key: "items", label: "Items" },
  { key: "total", label: "Total" },
  { key: "payment", label: "Payment" },
  { key: "fulfillment", label: "Fulfillment" },
];

// Static transactions data (replace API call)
const transactions = ref([
  {
    id: 1,
    orderId: "#BS-1001",
    date: "Oct 24, 2023",
    customerInitials: "AM",
    customerName: "Amina Mansour",
    items: "1x Royal Solitaire Ring",
    total: "$12,450",
    payment: "Paid",
    fulfillment: "Shipped",
  },
  {
    id: 2,
    orderId: "#BS-1002",
    date: "Oct 24, 2023",
    customerInitials: "RK",
    customerName: "Rohan Kapoor",
    items: "2x Eternal Gold Cufflinks",
    total: "$4,200",
    payment: "Paid",
    fulfillment: "Processing",
  },
  {
    id: 3,
    orderId: "#BS-1003",
    date: "Oct 23, 2023",
    customerInitials: "LD",
    customerName: "Lady Diana Spencer",
    items: "1x Heritage Pearl Choker",
    total: "$28,900",
    payment: "Pending",
    fulfillment: "Processing",
  },
  {
    id: 4,
    orderId: "#BS-1004",
    date: "Oct 22, 2023",
    customerInitials: "ZB",
    customerName: "Zayn Bakri",
    items: "1x Diamond Tennis Bracelet",
    total: "$8,500",
    payment: "Paid",
    fulfillment: "Delivered",
  },
]);

// Pagination (static)
const currentPage = ref(1);
const totalPages = 3;
const totalOrdersCount = 1248;

function goToPage(page) {
  if (page >= 1 && page <= totalPages) {
    currentPage.value = page;
  }
}

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
      
    <CommonTable
  :columns="tableColumns"
  :data="transactions"
  pagination
  @row-click="openOrder"
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