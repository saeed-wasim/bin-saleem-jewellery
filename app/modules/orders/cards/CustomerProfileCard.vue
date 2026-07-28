<script setup>
const props = defineProps({
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
});

const initials = computed(() =>
  (props.name || "?")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
);
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-sm font-semibold uppercase text-gray-500 mb-5 text-theme">
      Customer Profile
    </h3>

    <div class="flex gap-4">
      <div
        class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700"
      >
        {{ initials }}
      </div>

      <div>
        <h4 class="font-semibold">
          {{ name }}
        </h4>
      </div>
    </div>

    <div class="mt-6 space-y-3 text-sm">
      <p>{{ email }}</p>
      <p>{{ phone }}</p>
    </div>
  </div>
</template>
