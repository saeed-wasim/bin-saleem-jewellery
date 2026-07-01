export function useCustomersGetters() {
  return {
    customerCount: (state) => state.items.length,
    hasCustomers: (state) => state.items.length > 0,
  }
}
