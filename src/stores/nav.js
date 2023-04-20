import { defineStore } from 'pinia'

export const useNavStore = defineStore('counter', {
  state: () => {
    return { 
      resurces: [], 
      navigation: [] 
    }
  },
  actions: {
    setResources(res) {
      this.resurces = res
    },
    setNavigation(res) {
      this.navigation = res
    },
  },
  getters: {
    getResources(state) {
      return state.resurces
    },
    getNavigation(state) {
      return state.navigation
    },
  },
})