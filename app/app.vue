<script setup>
const toasts = useState('app-toasts', () => [])

const removeToast = (id) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    
    <!-- Global Toaster -->
    <div class="fixed top-4 right-4 z-[60] space-y-2">
      <CommonToaster
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </div>
  </div>
</template>
