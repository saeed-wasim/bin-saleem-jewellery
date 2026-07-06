<template>
  <div class="flex h-screen !bg-white">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Area -->
    <div class="w-full md:ml-64">
      <!-- Fixed Header -->
      <Header />

      <!-- Scrollable Content -->
      <main class="h-[calc(100vh-64px)] overflow-x-auto overflow-y-auto pt-4 bg-gray-50">
        <div class="px-6 min-w-full">
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