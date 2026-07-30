<script setup>
const props = defineProps({
  columns: Array,
  data: Array,
  pagination: Boolean,
  page: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["row-click", "page-change"]);

const pageWindow = computed(() => {
  const span = 5;
  let start = Math.max(1, props.page - Math.floor(span / 2));
  let end = Math.min(props.totalPages, start + span - 1);
  start = Math.max(1, end - span + 1);
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return pages;
});

const rangeStart = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.limit + 1));
const rangeEnd = computed(() => Math.min(props.page * props.limit, props.total));

function goTo(page) {
  if (page < 1 || page > props.totalPages || page === props.page) return;
  emit("page-change", page);
}
</script>

<template>
  <div>
    <div class="custom-scrollbar overflow-x-auto">
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
    </div>
     <!-- Pagination -->
      <div v-if="pagination && totalPages > 1" class="flex items-center justify-between mt-4">
        <span class="text-xs text-gray-400">
          Showing {{ rangeStart }}–{{ rangeEnd }} of {{ total }}
        </span>
        <div class="flex items-center gap-1">
          <button
            :disabled="page === 1"
            @click="goTo(page - 1)"
            class="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          <button
            v-if="pageWindow[0] > 1"
            @click="goTo(1)"
            class="w-7 h-7 flex items-center justify-center rounded-md text-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            1
          </button>
          <span v-if="pageWindow[0] > 2" class="px-1 text-gray-400">…</span>
          <button
            v-for="p in pageWindow"
            :key="p"
            @click="goTo(p)"
            class="w-7 h-7 flex items-center justify-center rounded-md text-sm"
            :class="p === page
              ? 'bg-theme text-white'
              : 'border border-gray-200 text-gray-600 hover:bg-gray-50'"
          >
            {{ p }}
          </button>
          <span v-if="pageWindow[pageWindow.length - 1] < totalPages - 1" class="px-1 text-gray-400">…</span>
          <button
            v-if="pageWindow[pageWindow.length - 1] < totalPages"
            @click="goTo(totalPages)"
            class="w-7 h-7 flex items-center justify-center rounded-md text-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            {{ totalPages }}
          </button>
          <button
            :disabled="page === totalPages"
            @click="goTo(page + 1)"
            class="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      </div>
      <div v-else-if="pagination && total > 0" class="mt-4 text-xs text-gray-400">
        Showing {{ rangeStart }}–{{ rangeEnd }} of {{ total }}
      </div>
    <div v-if="data.length === 0" class="text-center py-8 text-gray-500">
      No data available.
    </div>
  </div>
</template>
