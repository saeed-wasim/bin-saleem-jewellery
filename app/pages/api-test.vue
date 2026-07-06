<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">API Test</h1>
    <button class="bg-purple-600 text-white px-4 py-2 rounded" @click="loadCustomers">Load Customers</button>
    <pre class="mt-4 bg-gray-100 p-4 rounded">{{ payload }}</pre>
  </div>
</template>

<script setup>
const payload = ref('Click load to fetch data')

async function loadCustomers() {
  payload.value = 'Loading...'
  const response = await fetch('/api/customers')
  payload.value = await response.text()
}
</script>
