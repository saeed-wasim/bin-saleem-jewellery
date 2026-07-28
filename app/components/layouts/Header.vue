<script setup>
import searchIcon from "~/assets/icons/search.vue";
import notificationsIcon from "~/assets/icons/notifications.vue";

const { user } = useAuth();
</script>

<template>
  <header
    class="h-16 bg-white border-b flex items-center justify-end px-6 shrink-0"
  >

    <div class="flex items-center gap-4">
      <button
        class="border rounded-full p-2"
      >
        <notificationsIcon />
      </button>

      <NuxtLink v-if="user" to="/admin/profile" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div class="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold">
          {{ user.name?.charAt(0) }}
        </div>
        <span class="text-sm text-gray-600 hidden sm:inline">{{ user.name }}</span>
      </NuxtLink>
    </div>
  </header>
</template>