<script setup>
import cards from "~/components/common/Cards.vue";
import PageHeading from "~/components/common/PageHeading.vue";
const router = useRouter();

function openOrder(row) {
  router.push(`/admin/customer/${row.id}`);
}
// Replace with real data fetched via route.params.id


const tableColumns = [
  { key: "customer", label: "Customer" },
  { key: "phone", label: "Phone" },
  { key: "gender", label: "Gender" },
  { key: "city", label: "City" },
  { key: "totalOrders", label: "Total Orders" },
  { key: "lastOrder", label: "Last Order" },
];

const transactions = ref([
  {
    id: 1,
    image: "https://i.pravatar.cc/100?img=11",
    customerName: "Amara Al-Zayani",
    customerEmail: "amara.z@luxury.com",
    phone: "+92 300 1234567",
    gender: "Female",
    city: "Lahore",
    totalOrders: 24,
    lastOrder: "12 Oct 2023",
  },
  {
    id: 2,
    image: "https://i.pravatar.cc/100?img=12",
    customerName: "James Harrington",
    customerEmail: "j.harrington@wealth.co",
    phone: "+92 301 9876543",
    gender: "Male",
    city: "Islamabad",
    totalOrders: 12,
    lastOrder: "05 Nov 2023",
  },
  {
    id: 3,
    image: "https://i.pravatar.cc/100?img=13",
    customerName: "Sophia Chen",
    customerEmail: "sophia.c@design.io",
    phone: "+92 333 1112233",
    gender: "Female",
    city: "Karachi",
    totalOrders: 8,
    lastOrder: "28 Oct 2023",
  },
  {
    id: 4,
    image: "https://i.pravatar.cc/100?img=14",
    customerName: "Arthur Montgomery",
    customerEmail: "arthur.m@legacy.uk",
    phone: "+92 345 5557788",
    gender: "Male",
    city: "Rawalpindi",
    totalOrders: 42,
    lastOrder: "14 Nov 2023",
  },
]);
</script>

<template>
  <div class="tw-px-5">
    <PageHeading
       heading="Customer Management"
      description="Oversee your elite clientele and membership tiers."
    />

<div>
<cards/></div>

   

    <!-- Active Transactions -->
    <div class="bg-white rounded-xl border border-gray-200 p-5 custom-scrollbar  overflow-x-auto">
      
      <CommonTable
        :columns="tableColumns"
        :data="transactions"
        pagination
        @row-click="openOrder"
      >
        <template #cell-id="{ row }">
          <span class="text-purple-700 font-medium">{{ row.id }}</span>
        </template>

        <template #cell-customer="{ row }">
  <div class="flex items-center gap-3">
    <img
      :src="row.image"
      class="w-10 h-10 rounded-full object-cover"
      alt=""
    />
    <div>
      <p class="text-sm font-semibold text-gray-900">
        {{ row.customerName }}
      </p>
      <p class="text-xs text-gray-500">
        {{ row.customerEmail }}
      </p>
    </div>
  </div>
</template>

<template #cell-phone="{ row }">
  {{ row.phone }}
</template>

<template #cell-gender="{ row }">
  {{ row.gender }}
</template>

<template #cell-city="{ row }">
  {{ row.city }}
</template>

<template #cell-totalOrders="{ row }">
  {{ row.totalOrders }}
</template>

<template #cell-lastOrder="{ row }">
  {{ row.lastOrder }}
</template>
      </CommonTable>
    </div>
  </div>
</template>