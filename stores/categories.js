import { defineStore } from 'pinia'
import { useCategoriesState } from './categories/state'
import { useCategoriesGetters } from './categories/getters'
import { useCategoriesActions } from './categories/actions'

export const useCategoriesStore = defineStore('categories', {
  state: () => useCategoriesState(),
  getters: useCategoriesGetters(),
  actions: useCategoriesActions(),
})
