<script setup>
import Order from "~/modules/orders/components/Order.vue";
definePageMeta({
  layout: "admin",
});
</script>

<template>
  <NuxtLayout name="admin">
    <Order />
  </NuxtLayout>
</template>