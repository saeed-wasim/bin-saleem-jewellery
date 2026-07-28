<script setup>
const props = defineProps({
  paymentStatus: { type: String, default: "Pending" },
  fulfillmentStatus: { type: String, default: "Processing" },
  createdAt: { type: String, default: "" },
  updatedAt: { type: String, default: "" },
});

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const fulfillmentOrder = ["Processing", "Shipped", "Delivered"];

const journey = computed(() => {
  const steps = [{ title: "Order Placed", time: formatTime(props.createdAt) }];

  if (props.paymentStatus === "Paid") {
    steps.push({ title: "Payment Confirmed", time: formatTime(props.createdAt) });
  }

  const currentIndex = fulfillmentOrder.indexOf(props.fulfillmentStatus);
  fulfillmentOrder.slice(0, currentIndex + 1).forEach((status) => {
    steps.push({
      title: status === "Processing" ? "Preparing Order" : status,
      time: formatTime(props.updatedAt),
    });
  });

  return steps;
});
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
