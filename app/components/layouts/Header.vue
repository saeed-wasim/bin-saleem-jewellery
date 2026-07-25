<script setup>
import searchIcon from "~/assets/icons/search.vue";
import notificationsIcon from "~/assets/icons/notifications.vue";

const { user, logout } = useAuth();
const router = useRouter();

function handleLogout() {
  logout();
  router.push("/admin/login");
}
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

    <div class="flex items-center gap-4">
      <button
        class="border rounded-full p-2"
      >
        <notificationsIcon />
      </button>

      <div v-if="user" class="flex items-center gap-3">
        <span class="text-sm text-gray-600 hidden sm:inline">{{ user.name }}</span>
        <button
          @click="handleLogout"
          class="text-xs font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-900 border rounded-full px-4 py-2 transition"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>