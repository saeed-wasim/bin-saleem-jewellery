<script setup>
import PageHeading from "~/components/common/PageHeading.vue";

const route = useRoute();
const orderId = computed(() => route.params.id);
</script>

<template>
<div>
  <PageHeading
    :heading="`Order # ${orderId}`"
  />
</div>


</template>