<script setup>
import CloseIcon from "~/assets/icons/close.vue";
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Modal",
  },
  saving: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "confirm"]);

function handleConfirm() {
  if (props.saving) return;
  emit("confirm");
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-[70] flex items-center justify-end bg-black/40"
        @click.self="emit('close')"
      >
        <div class="bg-white h-screen w-full max-w-md shadow-2xl">
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800 uppercase tracking-wide">{{ title }}</h2>
            <button
              @click="emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
          <div class="p-6 custom-scrollbar overflow-y-auto h-[calc(100vh-130px)]" >
            <slot></slot>
          </div>
          <div class="flex justify-end gap-3 p-4 border-t border-gray-200">
            <button
              @click="emit('close')"
              :disabled="saving"
              class="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors uppercase text-xs font-semibold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              @click="handleConfirm"
              :disabled="saving"
              class="inline-flex items-center gap-2 px-6 py-2.5 text-white bg-[var(--theme-color)] rounded-lg hover:opacity-90 transition-colors uppercase text-xs font-semibold tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg
                v-if="saving"
                class="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              {{ saving ? 'Saving...' : 'Save' }}
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
