<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import DashboardIcon from '~/assets/css/icons/dashboard.vue'
import CategoriesIcon from '~/assets/css/icons/categories.vue'
import OrdersIcon from '~/assets/css/icons/orders.vue'
import CustomersIcon from '~/assets/css/icons/customers.vue'
import InventoryIcon from '~/assets/css/icons/inventory.vue'
import ReviewsIcon from '~/assets/css/icons/reviews.vue'
import PaymentsIcon from '~/assets/css/icons/payments.vue'

const route = useRoute()
const isOpen = ref(false)

const navItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: DashboardIcon
  },
  {
    name: 'Categories',
    path: '/admin/categories',
    icon: CategoriesIcon
  },
  {
    name: 'Orders',
    path: '/admin/orders',
    icon: OrdersIcon
  },
  {
    name: 'Customers',
    path: '/admin/customers',
    icon: CustomersIcon
  },
  {
    name: 'Inventory',
    path: '/admin/inventory',
    icon: InventoryIcon
  },
  {
    name: 'Reviews',
    path: '/admin/reviews',
    icon: ReviewsIcon
  },
  {
    name: 'Payments',
    path: '/admin/payments',
    icon: PaymentsIcon
  }
]

const isActive = (path) => route.path === path

const closeSidebar = () => {
  isOpen.value = false
}
</script>

<template>
  <!-- Mobile Header -->
  <div
    class="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow z-40 flex items-center px-4"
  >
    <button
      class="text-gray-700"
      @click="isOpen = true"
    >
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

    <h1 class="ml-4 font-bold text-[#4E0FA6]">
      Bin Saleem Jewellery
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
    class="fixed top-0 left-0 z-50
           w-64 h-screen bg-white shadow-lg
           flex flex-col
           transition-transform duration-300
           md:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- Logo -->
    <div
      class="p-6 border-b border-gray-200 flex items-center justify-between"
    >
      <h1 class="text-xl font-bold italic text-[#4E0FA6]">
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

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6">
      <ul class="space-y-1">
        <li
          v-for="item in navItems"
          :key="item.name"
        >
          <NuxtLink
            :to="item.path"
            class="flex items-center px-6 py-3 min-w-0 transition-all duration-200"
            :class="
              isActive(item.path)
                ? 'text-[#4E0FA6] bg-[#4E0FA61A] border-r-4 border-[#4E0FA6]'
                : 'text-gray-600 hover:text-[#4E0FA6] hover:bg-[#4E0FA61A]'
            "
            @click="closeSidebar"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 mr-3 shrink-0"
            />

            <span class="font-medium truncate">
              {{ item.name }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>    
  </aside>
</template>