<script setup>
import PageHeading from "~/components/common/PageHeading.vue";

definePageMeta({
  layout: "admin",
});

const page = ref(1);

const { data: reviewsPage, pending: loading, error: reviewsError } = await useApiFetch("/api/reviews", {
  key: "admin-reviews-list",
  query: computed(() => ({ page: page.value, limit: 10 })),
  watch: [page],
  default: () => ({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } }),
  // Revisiting this page via client-side nav must always show newly submitted
  // reviews, not Nuxt's cached snapshot from the first visit.
  getCachedData: () => undefined,
});

if (reviewsError.value) {
  console.error("Error fetching reviews:", reviewsError.value);
}

const reviews = computed(() => reviewsPage.value?.data || []);
const pageMeta = computed(() => reviewsPage.value?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });

const averageRating = computed(() => {
  if (!reviews.value.length) return 0;
  return reviews.value.reduce((sum, r) => sum + r.rating, 0) / reviews.value.length;
});

const tableColumns = [
  { key: "customer", label: "Customer" },
  { key: "product", label: "Product" },
  { key: "rating", label: "Rating", width: "140px" },
  { key: "comment", label: "Comment" },
  { key: "date", label: "Date", width: "120px" },
];

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initialsOf(name) {
  const trimmed = (name || "").trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

function avatarColor(initials) {
  const colors = [
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-blue-100 text-blue-700",
    "bg-red-100 text-red-700",
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
}

const rows = computed(() =>
  reviews.value.map((review) => ({
    id: review.id,
    customerInitials: initialsOf(review.customer?.name),
    customerPicture: review.customer?.picture || null,
    customerName: review.customer?.name || "Unknown",
    customerEmail: review.customer?.email || "",
    productName: review.product?.name || "Deleted product",
    productImage: review.product?.image,
    rating: review.rating,
    comment: review.comment || "—",
    date: formatDate(review.createdAt),
  }))
);
</script>

<template>
  <NuxtLayout name="admin">
    <div class="tw-px-5">
      <PageHeading heading="Customer Reviews" description="See what customers are saying about your products" />

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-sm text-gray-500">Total Reviews</p>
          <p class="mt-1 text-2xl font-bold text-gray-900">{{ pageMeta.total }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-sm text-gray-500">Average Rating (this page)</p>
          <div class="mt-1 flex items-center gap-2">
            <span class="text-2xl font-bold text-gray-900">{{ averageRating.toFixed(1) }}</span>
            <span class="text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.7l7.1-.6L12 2.5Z" />
              </svg>
            </span>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-sm text-gray-500">Showing</p>
          <p class="mt-1 text-2xl font-bold text-gray-900">Page {{ pageMeta.page }} of {{ pageMeta.totalPages }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-5 custom-scrollbar overflow-x-auto">
        <div v-if="loading" class="text-gray-500 py-8 text-center">Loading reviews...</div>
        <CommonTable
          v-else
          :columns="tableColumns"
          :data="rows"
          pagination
          :page="pageMeta.page"
          :total-pages="pageMeta.totalPages"
          :total="pageMeta.total"
          :limit="pageMeta.limit"
          @page-change="page = $event"
        >
          <template #cell-customer="{ row }">
            <div class="flex items-center gap-2">
              <img
                v-if="row.customerPicture"
                :src="row.customerPicture"
                :alt="row.customerName"
                class="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <span
                v-else
                class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                :class="avatarColor(row.customerInitials)"
              >
                {{ row.customerInitials }}
              </span>
              <div class="min-w-0">
                <p class="text-gray-800 truncate">{{ row.customerName }}</p>
                <p class="text-xs text-gray-400 truncate">{{ row.customerEmail }}</p>
              </div>
            </div>
          </template>

          <template #cell-product="{ row }">
            <div class="flex items-center gap-2">
              <img
                v-if="row.productImage"
                :src="row.productImage"
                class="w-8 h-8 rounded object-cover shrink-0"
              />
              <span class="truncate">{{ row.productName }}</span>
            </div>
          </template>

          <template #cell-rating="{ row }">
            <div class="flex text-amber-400">
              <svg
                v-for="star in 5"
                :key="star"
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                viewBox="0 0 24 24"
                :fill="star <= row.rating ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.7l7.1-.6L12 2.5Z" />
              </svg>
            </div>
          </template>

          <template #cell-comment="{ row }">
            <span class="text-gray-600 line-clamp-2 max-w-xs block whitespace-normal">{{ row.comment }}</span>
          </template>
        </CommonTable>
      </div>
    </div>
  </NuxtLayout>
</template>
