export function useItemsGetters() {
  return {
    itemCount: (state) => state.items.length,
    hasItems: (state) => state.items.length > 0,
  }
}
