<script setup>
import InventoryCard from "~/modules/orders/cards/InventoryCard.vue";
import CustomerProfileCard from "~/modules/orders/cards/CustomerProfileCard.vue";
import ShippingAddressCard from "~/modules/orders/cards/ShippingAddressCard.vue";
import OrderJourneyCard from "~/modules/orders/cards/OrderJourneyCard.vue";
import OrderDetail from "~/modules/orders/components/OrderDetail.vue";
const route = useRoute();

const orderId = computed(() => route.params.id);
definePageMeta({
  layout: "admin",
});
</script>

<template>
  <NuxtLayout name="admin">

  
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-8">
      <InventoryCard />
    </div>

    <div class="col-span-4 space-y-6">
      <CustomerProfileCard />

      <ShippingAddressCard />

      <OrderJourneyCard />
    </div>
  </div>
    </NuxtLayout>

</template>