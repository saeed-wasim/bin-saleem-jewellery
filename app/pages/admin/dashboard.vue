<script setup>
definePageMeta({
  layout: 'admin'
})
</script>

<template>
  <NuxtLayout name="admin">
    <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p class="text-3xl font-bold text-gray-800 mt-2">1,234</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p class="text-3xl font-bold text-gray-800 mt-2">$45,678</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">Total Customers</h3>
          <p class="text-3xl font-bold text-gray-800 mt-2">567</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">Products</h3>
          <p class="text-3xl font-bold text-gray-800 mt-2">89</p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>