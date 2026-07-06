<template>
  <NuxtLayout name="admin">
    <div>
      <h1 class="text-3xl font-bold mb-6">Orders</h1>

      <div class="rounded-lg bg-white p-6 shadow">
        <p>Orders management page</p>

        <div v-for="i in 100" :key="i" class="py-2 border-b">Row {{ i }}</div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: "admin",
});
</script>
