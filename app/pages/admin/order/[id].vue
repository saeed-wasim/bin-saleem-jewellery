<script setup>
import InventoryCard from "~/modules/orders/cards/InventoryCard.vue";
import CustomerProfileCard from "~/modules/orders/cards/CustomerProfileCard.vue";
import ShippingAddressCard from "~/modules/orders/cards/ShippingAddressCard.vue";
import OrderJourneyCard from "~/modules/orders/cards/OrderJourneyCard.vue";
import PageHeading from "~/components/common/PageHeading.vue";
const route = useRoute();

const orderId = computed(() => route.params.id);
definePageMeta({
  layout: "admin",
});

const { data: order, error } = await useApiFetch(() => `/api/orders/${orderId.value}`);

if (error.value) {
  console.error("Error fetching order:", error.value);
}
</script>

<template>
  <NuxtLayout name="admin">
    <div class="tw-px-5">
      <PageHeading :heading="`Order #BS-${orderId}`" description="Order details" />

      <div v-if="error" class="text-red-600">Unable to load this order.</div>

      <div v-else-if="order" class="grid grid-cols-12 gap-6">
        <div class="col-span-8">
          <InventoryCard
            :items="order.items"
            :subtotal="order.subtotal"
            :gst="order.gst"
            :shipping="order.shipping"
            :total="order.total"
          />
        </div>

        <div class="col-span-4 space-y-6">
          <CustomerProfileCard
            :name="order.customer?.name"
            :email="order.customer?.email"
            :phone="order.customer?.phone"
          />

          <ShippingAddressCard
            :name="order.addressName"
            :street="order.addressStreet"
            :city="order.addressCity"
            :phone="order.addressPhone"
          />

          <OrderJourneyCard
            :payment-status="order.paymentStatus"
            :fulfillment-status="order.fulfillmentStatus"
            :created-at="order.createdAt"
            :updated-at="order.updatedAt"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
