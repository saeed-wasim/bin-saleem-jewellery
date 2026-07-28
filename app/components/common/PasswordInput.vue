<script setup>
const props = defineProps({
  modelValue: { type: String, default: "" },
  required: { type: Boolean, default: false },
  minlength: { type: [Number, String], default: null },
  autocomplete: { type: String, default: "current-password" },
  invalid: { type: Boolean, default: false },
});

defineEmits(["update:modelValue"]);

const visible = ref(false);
</script>

<template>
  <div class="relative">
    <input
      :value="modelValue"
      :type="visible ? 'text' : 'password'"
      :required="required"
      :minlength="minlength"
      :autocomplete="autocomplete"
      class="w-full border rounded-lg px-4 py-3 pr-11 focus:outline-none focus:ring-1 transition"
      :class="invalid
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-[var(--theme-color)] focus:ring-[var(--theme-color)]'"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      type="button"
      :aria-label="visible ? 'Hide password' : 'Show password'"
      class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
      @click="visible = !visible"
    >
      <svg v-if="visible" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  </div>
</template>
