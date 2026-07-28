// Shared across every component that calls this — useApiFetch's `key` ties
// them to the same cached state, so calling refresh() from the order detail
// page updates the count the sidebar is already displaying, live.
export function useNewOrdersCount() {
  const { data, refresh } = useApiFetch('/api/orders/new-count', { key: 'admin-new-orders-count' })
  const count = computed(() => data.value?.count || 0)
  return { count, refresh }
}
