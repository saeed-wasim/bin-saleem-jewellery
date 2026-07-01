import { defineStore } from 'pinia'
import { useCustomersState } from './customers/state'
import { useCustomersGetters } from './customers/getters'
import { useCustomersActions } from './customers/actions'

export const useCustomersStore = defineStore('customers', {
  state: () => useCustomersState(),
  getters: useCustomersGetters(),
  actions: useCustomersActions(),
})
