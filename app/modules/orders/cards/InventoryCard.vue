<script setup>
const items = [
  {
    id: 1,
    image: "https://via.placeholder.com/60",
    name: "Eternal Grace Diamond Ring",
    details: "Platinum, 2.0ct VVS1",
    sku: "RG-PLAT-8821",
    qty: 1,
    price: "$18,500.00",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/60",
    name: "Sapphire Cascade Earrings",
    details: "18k Gold, Royal Blue Sapphires",
    sku: "ER-GOLD-4452",
    qty: 1,
    price: "$7,200.00",
  },
];
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
          <th>SKU</th>
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
                :src="item.image"
                class="w-14 h-14 rounded object-cover"
              />

              <div>
                <p class="font-medium">
                  {{ item.name }}
                </p>

                <p class="text-sm text-gray-500">
                  {{ item.details }}
                </p>
              </div>
            </div>
          </td>

          <td class="text-center">
            {{ item.sku }}
          </td>

          <td class="text-center">
            {{ item.qty }}
          </td>

          <td class="text-right font-semibold">
            {{ item.price }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-8 space-y-2 text-sm">
      <div class="flex justify-between">
        <span>Subtotal</span>
        <span>$25,700.00</span>
      </div>

      <div class="flex justify-between">
        <span>Tax (5%)</span>
        <span>$1,285.00</span>
      </div>

      <div class="flex justify-between">
        <span>Shipping</span>
        <span class="text-green-600">Complimentary</span>
      </div>

      <hr>

      <div class="flex justify-between text-xl font-bold text-purple-700">
        <span>Total</span>
        <span>$26,985.00</span>
      </div>
    </div>
  </div>
</template>