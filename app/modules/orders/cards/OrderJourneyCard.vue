<script setup>
const journey = [
  {
    title: "Order Placed",
    time: "Oct 24, 2023 - 02:14 PM",
  },
  {
    title: "Payment Confirmed",
    time: "Oct 24, 2023 - 02:20 PM",
  },
  {
    title: "Preparing Order",
    time: "Oct 24, 2023 - 03:05 PM",
  },
];
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-sm font-semibold uppercase text-gray-500 mb-5 text-theme">
      Order Journey
    </h3>

    <div
      v-for="(step, index) in journey"
      :key="index"
      class="flex gap-3 mb-5"
    >
      <div
        class="w-3 h-3 rounded-full bg-purple-700 mt-2"
      ></div>

      <div>
        <p class="font-medium">
          {{ step.title }}
        </p>

        <p class="text-sm text-gray-500">
          {{ step.time }}
        </p>
      </div>
    </div>
  </div>
</template>