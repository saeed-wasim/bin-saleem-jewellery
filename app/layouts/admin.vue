<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />

    <main class="pt-20 md:pt-0 md:ml-64 p-4 md:p-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '~/components/admin/sidebar/Sidebar.vue'
</script>