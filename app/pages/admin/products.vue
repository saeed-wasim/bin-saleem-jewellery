<script setup>
import products from "~/modules/products/components/Products.vue";
definePageMeta({
  layout: "admin",
});
</script>

<template>
  <NuxtLayout name="admin">
    <div>
      <products />
    </div>
  </NuxtLayout>
</template>
