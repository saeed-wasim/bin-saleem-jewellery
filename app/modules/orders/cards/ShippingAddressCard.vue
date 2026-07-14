<script setup>
const address = {
  building: "The Royal Penthouse",
  street: "Burj Khalifa Tower",
  city: "Dubai",
  country: "United Arab Emirates",
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-sm font-semibold uppercase text-gray-500 mb-5 text-theme">
      Shipping Address
    </h3>

    <div class="text-sm space-y-1">
      <p>{{ address.building }}</p>
      <p>{{ address.street }}</p>
      <p>{{ address.city }}</p>
      <p>{{ address.country }}</p>
    </div>

    <div class="mt-6 text-yellow-700 font-medium">
      Signature Required Upon Delivery
    </div>
  </div>
</template>