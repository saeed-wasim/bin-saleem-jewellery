<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <nav class="flex items-center flex-wrap gap-1.5 text-sm mb-4">
    <template v-for="(item, index) in items" :key="index">
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="text-gray-500 hover:text-theme transition-colors"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else class="font-medium text-gray-700">{{ item.label }}</span>

      <svg
        v-if="index < items.length - 1"
        xmlns="http://www.w3.org/2000/svg"
        class="w-3.5 h-3.5 text-gray-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </template>
  </nav>
</template>
