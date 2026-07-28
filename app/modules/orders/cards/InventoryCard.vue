<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
  subtotal: { type: [Number, String], default: 0 },
  gst: { type: [Number, String], default: 0 },
  shipping: { type: [Number, String], default: 0 },
  total: { type: [Number, String], default: 0 },
});

function formatPrice(value) {
  return `Rs ${Number(value).toLocaleString("en-IN")}`;
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6 text-theme">
      Inventory Items
    </h2>

    <table class="w-full">
      <thead class="border-b">
        <tr class="text-xs text-gray-500 uppercase">
          <th class="text-left pb-3">Product</th>
          <th>Qty</th>
          <th class="text-right">Price</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
          class="border-b"
        >
          <td class="py-4">
            <div class="flex gap-3">
              <img
                :src="item.image || NO_IMAGE_PLACEHOLDER"
                class="w-14 h-14 rounded object-cover"
                @error="(e) => e.target.src = NO_IMAGE_PLACEHOLDER"
              />

              <div>
                <p class="font-medium">
                  {{ item.name }}
                </p>

                <p class="text-sm text-gray-500">
                  <span v-if="item.color">{{ item.color }}</span>
                  <span v-if="item.color && item.size"> &middot; </span>
                  <span v-if="item.size">Size {{ item.size }}</span>
                </p>
              </div>
            </div>
          </td>

          <td class="text-center">
            {{ item.qty }}
          </td>

          <td class="text-right font-semibold">
            {{ formatPrice(item.price) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-8 space-y-2 text-sm">
      <div class="flex justify-between">
        <span>Subtotal</span>
        <span>{{ formatPrice(subtotal) }}</span>
      </div>

      <div class="flex justify-between">
        <span>GST (3%)</span>
        <span>{{ formatPrice(gst) }}</span>
      </div>

      <div class="flex justify-between">
        <span>Shipping</span>
        <span class="text-green-600">{{ Number(shipping) > 0 ? formatPrice(shipping) : "Complimentary" }}</span>
      </div>

      <hr>

      <div class="flex justify-between text-xl font-bold text-purple-700">
        <span>Total</span>
        <span>{{ formatPrice(total) }}</span>
      </div>
    </div>
  </div>
</template>
