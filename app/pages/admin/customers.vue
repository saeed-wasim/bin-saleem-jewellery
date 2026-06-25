<template>
  <NuxtLayout name="admin">
    <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Customers</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Customers management page</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})
</script>
