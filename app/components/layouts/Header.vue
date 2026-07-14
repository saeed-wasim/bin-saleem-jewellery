<script setup>
import searchIcon from "~/assets/icons/search.vue";
import notificationsIcon from "~/assets/icons/notifications.vue";
</script>

<template>
  <header
    class="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0"
  >
    <div class="relative hidden sm:block">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <searchIcon />
      </span>

      <input
        type="search"
        placeholder="Search..."
        class="h-10 w-72 rounded-full border pl-10 pr-4 focus:outline-none"
      />
    </div>

    <button
      class="border rounded-full p-2"
    >
      <notificationsIcon />
    </button>
  </header>
</template>