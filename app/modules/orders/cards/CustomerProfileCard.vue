<script setup>
const customer = {
  initials: "AV",
  name: "Alexander Vanguard",
  tier: "Platinum VVIP",
  email: "a.vanguard@royal.ae",
  phone: "+971 50 123 4567",
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-sm font-semibold uppercase text-gray-500 mb-5 text-theme">
      Customer Profile
    </h3>

    <div class="flex gap-4">
      <div
        class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700"
      >
        {{ customer.initials }}
      </div>

      <div>
        <h4 class="font-semibold">
          {{ customer.name }}
        </h4>

        <p class="text-sm text-gray-500">
          Tier: {{ customer.tier }}
        </p>
      </div>
    </div>

    <div class="mt-6 space-y-3 text-sm">
      <p>{{ customer.email }}</p>
      <p>{{ customer.phone }}</p>
    </div>
  </div>
</template>