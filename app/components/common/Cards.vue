<script setup>
const stats = [
  {
    label: "Total Customers",
    value: "12,482",
    note: "+12% vs last month",
    noteColor: "text-emerald-500",
    icon: "users",
  },
  {
    label: "Active Members",
    value: "8,912",
    note: "Elite conversion high",
    noteColor: "text-amber-500",
    icon: "badge",
  },
  {
    label: "Avg. Lifetime Value",
    value: "$4,250",
    note: "Per capita luxury spend",
    noteColor: "text-emerald-600",
    icon: "wallet",
  },
];
</script>

<template>
  <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
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

        <!-- Wallet icon -->
        <svg
          v-else
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
      </div>

      <p class="mt-3 text-3xl font-bold text-purple-950">{{ stat.value }}</p>

      <p class="mt-2 flex items-center gap-1 text-xs font-medium" :class="stat.noteColor">
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M3 17l6-6 4 4 8-8M21 7v6M21 7h-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ stat.note }}
      </p>
    </div>
  </div>
</template>