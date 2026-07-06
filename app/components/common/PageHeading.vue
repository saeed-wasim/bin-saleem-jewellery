<script setup lang="ts">
defineProps({
  heading: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div
    class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5"
  >
    <!-- Left Content -->
    <div class="flex-1">
      <h1 class="text-3xl font-semibold text-[var(--theme-color)] font-poppins">
        {{ heading }}
      </h1>

      <p
        v-if="description"
        class="mt-1 text-sm text-gray-500"
      >
        {{ description }}
      </p>
    </div>

    <!-- Right Actions -->
    <div class="flex flex-wrap items-center justify-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>