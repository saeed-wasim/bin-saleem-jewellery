<template>
  <div class=" custom-scrollbar h-screen overflow-hidden bg-gray-50">
    <Sidebar />

    <!-- Right Side -->
    <div class="md:pl-64 h-screen flex flex-col">
      <Header />

      <!-- Page -->
      <main class="flex-1 custom-scrollbar  overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "~/components/layouts/Sidebar.vue";
import Header from "~/components/layouts/Header.vue";
</script>