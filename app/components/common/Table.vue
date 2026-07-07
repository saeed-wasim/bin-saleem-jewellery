<script setup>
defineProps({
  columns: Array,
  data: Array,
  pagination: Boolean,
  currentPage: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["row-click"]);

const config = useRuntimeConfig();
const backendUrl = config.public.backendUrl;
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full bg-white border border-gray-200">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            :style="column.width ? `width: ${column.width}` : ''"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
  v-for="(row, rowIndex) in data"
  :key="rowIndex"
  class="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
  @click="emit('row-click', row)"
>
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
            :style="column.width ? `width: ${column.width}` : ''"
          >
            <slot :name="`cell-${column.key}`" :row="row" :column="column">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
     <!-- Pagination -->
      <div v-if="pagination" class="flex items-center justify-between mt-4">
        <span class="text-xs text-gray-400">
          Showing 10 of 30 orders
        </span>
        <div class="flex items-center gap-1">
          <button
           
            class="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50"
          >
            ‹
          </button>
          <button
            v-for="page in 10"
            :key="page"
            class="w-7 h-7 flex items-center justify-center rounded-md text-sm"
            :class="page === currentPage
              ? 'bg-purple-800 text-white'
              : 'border border-gray-200 text-gray-600 hover:bg-gray-50'"
          >
            {{ page }}
          </button>
          <button
            class="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50"
          >
            ›
          </button>
        </div>
      </div>
    <div v-if="data.length === 0" class="text-center py-8 text-gray-500">
      No data available.
    </div>
  </div>
</template>
