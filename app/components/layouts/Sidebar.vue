<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

import DashboardIcon from "~/assets/icons/dashboard.vue";
import CategoriesIcon from "~/assets/icons/categories.vue";
import OrdersIcon from "~/assets/icons/orders.vue";
import CustomersIcon from "~/assets/icons/customers.vue";
import InventoryIcon from "~/assets/icons/inventory.vue";
import ReviewsIcon from "~/assets/icons/reviews.vue";
import PaymentsIcon from "~/assets/icons/payments.vue";
import ProfileIcon from "~/assets/icons/profile.vue";
import LogoutIcon from "~/assets/icons/logout.vue";

const route = useRoute();
const router = useRouter();
const { logout } = useAuth();

const isOpen = ref(false);
const showLogoutConfirm = ref(false);

const { count: newOrdersCount } = useNewOrdersCount();

function handleLogout() {
  logout();
  showLogoutConfirm.value = false;
  isOpen.value = false;
  router.push("/admin/login");
}

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: DashboardIcon },
  { name: "Products", path: "/admin/products", icon: CategoriesIcon },
  { name: "Orders", path: "/admin/orders", icon: OrdersIcon },
  { name: "Customers", path: "/admin/customers", icon: CustomersIcon },
  { name: "Inventory", path: "/admin/inventory", icon: InventoryIcon },
  { name: "Reviews", path: "/admin/reviews", icon: ReviewsIcon },
  { name: "Payments", path: "/admin/payments", icon: PaymentsIcon },
  { name: "Profile", path: "/admin/profile", icon: ProfileIcon },
];

const isActive = (path) => {
  if (path === "/admin/dashboard") {
    return route.path === "/admin/dashboard";
  }
  if (path === "/admin/orders") {
    return (
      route.path === "/admin/orders" ||
      route.path.startsWith("/admin/order/")
    );
  }
  if (path === "/admin/customers") {
    return (
      route.path === "/admin/customers" ||
      route.path.startsWith("/admin/customer/")
    );
  }
  return route.path === path;
};

const closeSidebar = () => {
  isOpen.value = false;
};
</script>

<template>
  <!-- Mobile Top Bar -->
  <div
    class="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 md:hidden z-40"
  >
    <button @click="isOpen = true">
      ☰
    </button>

    <h1 class="font-bold italic text-theme text-lg">
      Bin Saleem
      <span class="text-gray-400">Jewellery</span>
    </h1>
  </div>

  <!-- Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 z-40 md:hidden"
    @click="closeSidebar"
  />

  <!-- Sidebar -->
  <aside
    class="fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r transition-transform duration-300 flex flex-col"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <div
      class="h-16 border-b flex items-center justify-between px-6 shrink-0"
    >
      <h1 class="text-xl italic font-bold text-theme">
        Bin Saleem
        <span class="text-gray-400">Jewellery</span>
      </h1>

      <button
        class="md:hidden"
        @click="closeSidebar"
      >
        ✕
      </button>
    </div>

    <nav class="py-6 custom-scrollbar overflow-y-auto flex-1">
      <ul class="space-y-1">
        <li
          v-for="item in navItems"
          :key="item.name"
        >
          <NuxtLink
            :to="item.path"
            @click="closeSidebar"
            class="flex items-center justify-between px-6 py-3 transition"
            :class="
              isActive(item.path)
                ? 'bg-themeSoft text-theme border-r-4 border-theme'
                : 'hover:bg-themeSoft text-gray-600 hover:text-theme'
            "
          >
            <span class="flex items-center">
              <component
                :is="item.icon"
                class="mr-3 h-5 w-5"
              />

              {{ item.name }}
            </span>

            <span
              v-if="item.path === '/admin/orders' && newOrdersCount > 0"
              class="ml-2 inline-flex items-center justify-center rounded-full bg-theme text-white text-xs font-semibold px-2 py-0.5"
            >
              {{ newOrdersCount }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Logout — pinned as the last option, always visible -->
    <div class="border-t border-gray-100 p-3 shrink-0">
      <button
        type="button"
        @click="showLogoutConfirm = true"
        class="flex w-full items-center rounded-lg px-3 py-3 text-red-600 transition hover:bg-red-50"
      >
        <LogoutIcon class="mr-3 h-5 w-5" />
        Logout
      </button>
    </div>
  </aside>

  <CommonConfirmModal
    :show="showLogoutConfirm"
    title="Log Out"
    message="Are you sure you want to log out of the admin panel?"
    confirm-text="Logout"
    cancel-text="Cancel"
    type="danger"
    @close="showLogoutConfirm = false"
    @confirm="handleLogout"
  />
</template>