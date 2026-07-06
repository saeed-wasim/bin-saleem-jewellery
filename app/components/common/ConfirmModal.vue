<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Confirm Action",
  },
  message: {
    type: String,
    default: "Are you sure you want to proceed?",
  },
  confirmText: {
    type: String,
    default: "Confirm",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
  type: {
    type: String,
    default: "danger",
    validator: (value) => ["danger", "warning", "info"].includes(value),
  },
});

const emit = defineEmits(["close", "confirm"]);

const typeClasses = {
  danger: "bg-red-600 hover:bg-red-700",
  warning: "bg-yellow-600 hover:bg-yellow-700",
  info: "bg-blue-600 hover:bg-blue-700",
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-black/50"
        @click.self="emit('close')"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ title }}</h3>
            <p class="text-gray-600">{{ message }}</p>
          </div>
          <div class="flex justify-end gap-3 px-6 pb-6">
            <button
              @click="emit('close')"
              class="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors uppercase text-xs font-semibold tracking-wider"
            >
              {{ cancelText }}
            </button>
            <button
              @click="emit('confirm')"
              :class="[
                'px-6 py-2.5 text-white rounded-lg transition-colors uppercase text-xs font-semibold tracking-wider',
                typeClasses[type]
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
