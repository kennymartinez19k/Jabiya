import currentPage from '../store/currentPage'

const storeModule = {
  state: () => (
    {
      ...currentPage.state,
      scanOrder: null
    }
  ),
  mutations: {
    ...currentPage.mutations,
    scanOrder(state, val){
      state.scanOrder = val
    }
  },
  actions: {
    ...currentPage.actions
  },
  getters: {
    ...currentPage.getters,
    orderScan : state => state.scanOrder
  }
}

export default storeModule