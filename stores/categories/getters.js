export function useCategoriesGetters() {
  return {
    categoryCount: (state) => state.items.length,
    hasCategories: (state) => state.items.length > 0,
  }
}
