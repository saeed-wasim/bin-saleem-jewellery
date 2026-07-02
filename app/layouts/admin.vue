<template>
  <div class="flex h-screen !bg-white">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Area -->
    <div class="flex flex-1 flex-col md:ml-64">
      <!-- Fixed Header -->
      <Header />

      <!-- Scrollable Content -->
      <main class="flex-1 overflow-y-auto pt-4 bg-gray-50">
        <div class="px-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "~/components/layouts/Sidebar.vue";
import Header from "~/components/layouts/Header.vue";
</script>