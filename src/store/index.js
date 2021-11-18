import currentPage from '../store/currentPage'
import loads from '../store/Loads'

const storeModule = {
  state: () => (
    {
      ...currentPage.state,
      ...loads.state,
      scanOrder: null
    }
  ),
  mutations: {
    ...currentPage.mutations,
    ...loads.mutations,
    scanOrder(state, val){
      state.scanOrder = val
    }
  },
  actions: {
    ...currentPage.actions,
    ...loads.actions
  },
  getters: {
    ...currentPage.getters,
    ...loads.getters,
    orderScan : state => state.scanOrder
  }
}

export default storeModule