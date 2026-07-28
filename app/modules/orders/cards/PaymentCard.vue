<script setup>
const props = defineProps({
  paymentStatus: { type: String, default: "Pending" },
  paymentMethod: { type: String, default: "" },
  cardBrand: { type: String, default: "" },
  cardLast4: { type: String, default: "" },
});

function statusClass(status) {
  return status === "Paid" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700";
}

const brandLabel = computed(() => {
  if (!props.cardBrand) return "";
  return props.cardBrand.charAt(0).toUpperCase() + props.cardBrand.slice(1);
});
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-sm font-semibold uppercase text-gray-500 mb-5 text-theme">Payment</h3>

    <div class="text-sm space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-gray-500">Status</span>
        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" :class="statusClass(paymentStatus)">
          {{ paymentStatus }}
        </span>
      </div>

      <div v-if="paymentMethod" class="flex items-center justify-between">
        <span class="text-gray-500">Method</span>
        <span class="font-medium text-gray-800">{{ paymentMethod }}</span>
      </div>

      <div v-if="cardBrand && cardLast4" class="flex items-center justify-between">
        <span class="text-gray-500">Card</span>
        <span class="font-medium text-gray-800">{{ brandLabel }} &bull;&bull;&bull;&bull; {{ cardLast4 }}</span>
      </div>
    </div>
  </div>
</template>
