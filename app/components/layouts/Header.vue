<script setup>
import searchIcon from "~/assets/css/icons/search.vue";
import notificationsIcon from "~/assets/css/icons/notifications.vue";
</script>

<template>
  <header
    class="flex justify-between md:left-64 h-16 bg-white border-b z-50 flex items-center px-6"
  >
    <div class="flex items-center gap-4">
      <div class="relative hidden sm:block">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <searchIcon />
        </span>
        <input
          type="search"
          placeholder="Search..."
          class="h-10 rounded-full border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 focus:border-theme focus:outline-none focus:ring-2 focus:ring-themeSoft"
        />
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button
        class="rounded-full border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50"
      >
        <notificationsIcon />
      </button>
    </div>
  </header>
</template>
