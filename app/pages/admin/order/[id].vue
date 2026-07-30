<script setup>
import InventoryCard from "~/modules/orders/cards/InventoryCard.vue";
import CustomerProfileCard from "~/modules/orders/cards/CustomerProfileCard.vue";
import ShippingAddressCard from "~/modules/orders/cards/ShippingAddressCard.vue";
import PaymentCard from "~/modules/orders/cards/PaymentCard.vue";
import OrderJourneyCard from "~/modules/orders/cards/OrderJourneyCard.vue";
import OrderStatusCard from "~/modules/orders/cards/OrderStatusCard.vue";
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

function handleStatusUpdated(updated) {
  order.value = updated;
}
</script>

<template>
  <NuxtLayout name="admin">
    <div class="tw-px-5">
      <CommonBreadcrumbs
        :items="[
          { label: 'Orders', to: '/admin/orders' },
          { label: `Order #BS-${orderId}` },
        ]"
      />

      <PageHeading :heading="`Order #BS-${orderId}`" description="Order details" />

      <div v-if="error" class="text-red-600">Unable to load this order.</div>

      <div v-else-if="order" class="space-y-6">
        <InventoryCard
          :items="order.items"
          :subtotal="order.subtotal"
          :gst="order.gst"
          :shipping="order.shipping"
          :total="order.total"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomerProfileCard
            :name="order.customer?.name"
            :email="order.customer?.email"
            :phone="order.customer?.phone"
            :picture="order.customer?.picture"
          />

          <ShippingAddressCard
            :name="order.addressName"
            :street="order.addressStreet"
            :city="order.addressCity"
            :phone="order.addressPhone"
          />

          <PaymentCard
            :payment-status="order.paymentStatus"
            :payment-method="order.paymentMethod"
            :card-brand="order.cardBrand"
            :card-last4="order.cardLast4"
          />

          <OrderStatusCard
            :order-id="order.id"
            :fulfillment-status="order.fulfillmentStatus"
            :payment-status="order.paymentStatus"
            @updated="handleStatusUpdated"
          />

          <OrderJourneyCard
            :payment-status="order.paymentStatus"
            :fulfillment-status="order.fulfillmentStatus"
            :created-at="order.createdAt"
            :shipped-at="order.shippedAt"
            :delivered-at="order.deliveredAt"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
