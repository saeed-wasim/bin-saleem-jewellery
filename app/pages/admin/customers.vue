<script setup>
import Customer from '~/modules/customer/components/Customer.vue'
definePageMeta({
  layout: 'admin'
})
</script>


<template>
  <NuxtLayout name="admin">
   <Customer />
  </NuxtLayout>
</template>