<script setup>
defineProps({
  stats: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    >
      <div class="flex items-start justify-between">
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {{ stat.label }}
        </p>

        <!-- Users icon -->
        <svg
          v-if="stat.icon === 'users'"
          class="h-6 w-6 text-purple-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9 11a4 4 0 100-8 4 4 0 000 8zM23 20v-1a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- Badge / check icon -->
        <svg
          v-else-if="stat.icon === 'badge'"
          class="h-6 w-6 text-purple-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M12 2l2.39 1.7 2.86-.34 1.14 2.63 2.63 1.14-.34 2.86L22.4 12l-1.72 2.01.34 2.86-2.63 1.14-1.14 2.63-2.86-.34L12 22l-2.39-1.7-2.86.34-1.14-2.63-2.63-1.14.34-2.86L1.6 12l1.72-2.01-.34-2.86 2.63-1.14 1.14-2.63 2.86.34z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <!-- Wallet / revenue icon -->
        <svg
          v-else-if="stat.icon === 'wallet'"
          class="h-6 w-6 text-purple-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="2" y="6" width="20" height="14" rx="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M2 10h20" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none" />
        </svg>

        <!-- Cart / orders icon -->
        <svg
          v-else-if="stat.icon === 'cart'"
          class="h-6 w-6 text-purple-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="9" cy="21" r="1" fill="currentColor" stroke="none" />
          <circle cx="20" cy="21" r="1" fill="currentColor" stroke="none" />
          <path
            d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- Box / products icon -->
        <svg
          v-else-if="stat.icon === 'box'"
          class="h-6 w-6 text-purple-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- Alert / low-stock icon -->
        <svg
          v-else-if="stat.icon === 'alert'"
          class="h-6 w-6 text-purple-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1 1 0 003 19.5h18a1 1 0 00.89-1.46L13.71 3.86a1 1 0 00-1.72 0z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- Chart / value icon -->
        <svg
          v-else
          class="h-6 w-6 text-purple-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M3 3v18h18" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M7 15l4-4 3 3 5-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <p class="mt-3 text-3xl font-bold text-theme">{{ stat.value }}</p>

      <p v-if="stat.note" class="mt-2 flex items-center gap-1 text-xs font-medium" :class="stat.noteColor || 'text-gray-400'">
        {{ stat.note }}
      </p>
    </div>
  </div>
</template>
