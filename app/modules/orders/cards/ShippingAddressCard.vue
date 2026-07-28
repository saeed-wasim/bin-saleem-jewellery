<script setup>
defineProps({
  name: { type: String, default: "" },
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  phone: { type: String, default: "" },
});
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-sm font-semibold uppercase text-gray-500 mb-5 text-theme">
      Shipping Address
    </h3>

    <div class="text-sm space-y-1">
      <p>{{ name }}</p>
      <p>{{ street }}</p>
      <p>{{ city }}</p>
      <p>{{ phone }}</p>
    </div>
  </div>
</template>
