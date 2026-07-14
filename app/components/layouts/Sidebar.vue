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

const route = useRoute();
const isOpen = ref(false);

const navItems = [
<<<<<<< Updated upstream
  {
    name: "Dashboard",
    path: "/admin",
    icon: DashboardIcon,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: CategoriesIcon,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: OrdersIcon,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: CustomersIcon,
  },
  {
    name: "Inventory",
    path: "/admin/inventory",
    icon: InventoryIcon,
  },
  {
    name: "Reviews",
    path: "/admin/reviews",
    icon: ReviewsIcon,
  },
  {
    name: "Payments",
    path: "/admin/payments",
    icon: PaymentsIcon,
  },
];

const isActive = (path) => route.path === path;
=======
  { name: "Dashboard", path: "/admin/dashboard", icon: DashboardIcon },
  { name: "Products", path: "/admin/products", icon: CategoriesIcon },
  { name: "Orders", path: "/admin/orders", icon: OrdersIcon },
  { name: "Customers", path: "/admin/customers", icon: CustomersIcon },
  { name: "Inventory", path: "/admin/inventory", icon: InventoryIcon },
  { name: "Reviews", path: "/admin/reviews", icon: ReviewsIcon },
  { name: "Payments", path: "/admin/payments", icon: PaymentsIcon },
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
>>>>>>> Stashed changes

const closeSidebar = () => {
  isOpen.value = false;
};
</script>

<template>
  <!-- Mobile Header -->
  <div
    class="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow z-40 flex items-center px-4"
  >
    <button class="text-gray-700" @click="isOpen = true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

<h1 class="text-xl font-bold italic text-theme px-4">
        Bin Saleem
        <span class="text-gray-400">Jewellery</span>
      </h1>  </div>

  <!-- Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 z-40 md:hidden"
    @click="closeSidebar"
  />

  <!-- Sidebar -->
  <aside
    class="fixed left-0 top-0 h-screen w-64 bg-white border-r"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- Logo -->
    <div class="px-6 h-16 border-b border-gray-200 flex items-center justify-between">
      <h1 class="text-xl font-bold italic text-theme">
        Bin Saleem
        <span class="text-gray-400">Jewellery</span>
      </h1>

      <button class="md:hidden" @click="closeSidebar">✕</button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.name">
          <NuxtLink
            :to="item.path"
            class="flex items-center px-6 py-3 min-w-0 transition-all duration-200"
            :class="
              isActive(item.path)
                ? 'text-theme bg-themeSoft border-r-4 border-theme'
                : 'text-gray-600 hover:text-theme hover:bg-themeSoft'
            "
            @click="closeSidebar"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3 shrink-0" />

            <span class="font-medium truncate">
              {{ item.name }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
