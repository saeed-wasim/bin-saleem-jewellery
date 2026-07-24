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
];

const {
  data: customers,
  pending: loading,
  error,
} = await useApiFetch("/api/customers", {
  default: () => [],
});
</script>

<template>
  <div class="tw-px-5">
    <PageHeading
       heading="Customer Management"
      description="Oversee your elite clientele and membership tiers."
    />

<div>
<Cards/></div>

    <!-- Customers -->
    <div class="bg-white rounded-xl border border-gray-200 p-5 custom-scrollbar overflow-x-auto">
      <div v-if="loading" class="text-gray-500">Loading customers...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <CommonTable
        v-else
        :columns="tableColumns"
        :data="customers"
        pagination
        @row-click="openOrder"
      >
        <template #cell-customer="{ row }">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold">
              {{ row.name?.charAt(0) }}
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
      </CommonTable>
    </div>
  </div>
</template>