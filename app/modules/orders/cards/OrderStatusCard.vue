<script setup>
const props = defineProps({
  orderId: { type: [Number, String], required: true },
  fulfillmentStatus: { type: String, default: "Processing" },
});

const emit = defineEmits(["updated"]);

const toasts = useState("app-toasts", () => []);
const addToast = (message, type = "success", duration = 3000) => {
  const toast = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, message, type, duration };
  toasts.value = [...toasts.value, toast];
  if (duration > 0) {
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toast.id);
    }, duration);
  }
};

const statuses = [
  { value: "Processing", label: "Processing" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
];

const updating = ref(false);
const { refresh: refreshNewOrdersCount } = useNewOrdersCount();

async function setStatus(status) {
  if (status === props.fulfillmentStatus || updating.value) return;

  updating.value = true;
  try {
    const updated = await apiFetch(`/api/orders/${props.orderId}/status`, {
      method: "PATCH",
      body: { status },
    });
    addToast(`Order marked as ${status}`, "success");
    emit("updated", updated);
    refreshNewOrdersCount();
  } catch (err) {
    addToast(err?.data?.error || "Unable to update status", "error");
  } finally {
    updating.value = false;
  }
}

function statusIndex(status) {
  return statuses.findIndex((s) => s.value === status);
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-sm font-semibold uppercase text-gray-500 mb-5 text-theme">
      Order Status
    </h3>

    <div class="flex rounded-lg border border-gray-200 overflow-hidden">
      <button
        v-for="(status, index) in statuses"
        :key="status.value"
        type="button"
        :disabled="updating"
        class="flex-1 py-3 text-xs font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed"
        :class="[
          index < statuses.length - 1 ? 'border-r border-gray-200' : '',
          index <= statusIndex(fulfillmentStatus)
            ? 'bg-purple-700 text-white'
            : 'bg-white text-gray-500 hover:bg-gray-50',
        ]"
        @click="setStatus(status.value)"
      >
        {{ status.label }}
      </button>
    </div>

    <p class="mt-3 text-xs text-gray-400">
      Click a stage to mark this order as {{ updating ? 'updating…' : 'reached that stage' }}.
    </p>
  </div>
</template>
