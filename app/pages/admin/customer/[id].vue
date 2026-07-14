<script setup>
import Cards from "~/components/common/Cards.vue";

definePageMeta({
  layout: "admin",
});

const client = {
  totalLifetimeSpent: "$482,900.00",
  orderFrequency: "4.2 / Year",
  lastPurchase: "12 Days ago",
  preferredCategory: "Bespoke Diamond Rings",
  email: "a.vanguard@vanguardestates.com",
  phone: "+1 (212) 555-0982",
  address: "745 Park Avenue, Penthouse B\nNew York, NY 10021, USA",
};
</script>

<template>
  <NuxtLayout name="admin">
    <div class="flex flex-col gap-4 p-4 md:flex-row md:items-stretch">

      <!-- Client Insights Card -->
      <div
        class="flex flex-1 flex-col rounded-2xl bg-gradient-to-br from-purple-800 to-purple-900 p-5 text-white shadow-lg md:min-h-[300px]"
      >
        <h3 class="text-sm font-semibold text-purple-200">
          Client Insights
        </h3>

        <p
          class="mt-4 text-[11px] font-medium uppercase tracking-wide text-purple-300"
        >
          Total Lifetime Spent
        </p>
        <p class="mt-1 text-2xl font-bold">
          {{ client.totalLifetimeSpent }}
        </p>

        <div class="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p
              class="text-[11px] font-medium uppercase tracking-wide text-purple-300"
            >
              Order Frequency
            </p>
            <p class="mt-1 text-sm font-semibold">
              {{ client.orderFrequency }}
            </p>
          </div>

          <div>
            <p
              class="text-[11px] font-medium uppercase tracking-wide text-purple-300"
            >
              Last Purchase
            </p>
            <p class="mt-1 text-sm font-semibold">
              {{ client.lastPurchase }}
            </p>
          </div>
        </div>

        <div class="mt-auto border-t border-purple-600/50 pt-4">
          <p
            class="text-[11px] font-medium uppercase tracking-wide text-purple-300"
          >
            Preferred Category
          </p>

          <div
            class="mt-2 flex items-center gap-2 rounded-lg bg-purple-950/40 px-3 py-2"
          >
            <svg
              class="h-4 w-4 flex-shrink-0 text-amber-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 2l2.5 5.5L20 9l-4.5 4 1.5 6-5-3.5L7 19l1.5-6L4 9l5.5-1.5z"
              />
            </svg>

            <span class="text-sm font-medium">
              {{ client.preferredCategory }}
            </span>
          </div>
        </div>
      </div>

      <!-- Contact Details Card -->
      <div
        class="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:min-h-[300px]"
      >
        <h3 class="text-sm font-semibold text-gray-500">
          Contact Details
        </h3>

        <div class="mt-4 space-y-4">
          <div class="flex items-start gap-3">
            <div
              class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-700"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-400"
              >
                Email Address
              </p>

              <p class="mt-0.5 break-all text-sm font-medium text-gray-800">
                {{ client.email }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div
              class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-700"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M3 5a2 2 0 012-2h2.28a1 1 0 01.98.8l.72 3.6a1 1 0 01-.5 1.1l-1.5.86a12 12 0 006 6l.86-1.5a1 1 0 011.1-.5l3.6.72a1 1 0 01.8.98V19a2 2 0 01-2 2h-1C9.4 21 3 14.6 3 6V5z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-400"
              >
                Phone Number
              </p>

              <p class="mt-0.5 text-sm font-medium text-gray-800">
                {{ client.phone }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div
              class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-700"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-400"
              >
                Primary Address
              </p>

              <p class="mt-0.5 whitespace-pre-line text-sm font-medium text-gray-800">
                {{ client.address }}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>