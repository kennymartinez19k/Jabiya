import currentPage from '../store/currentPage'
import loads from '../store/Loads'
import timelineStore from '../store/TimelineStore'

const storeModule = {
  state: () => (
    {
      ...currentPage.state,
      ...loads.state,
      ...timelineStore.state,
      scanOrder: null
    }
  ),
  mutations: {
    ...currentPage.mutations,
    ...loads.mutations,
    ...timelineStore.mutations,
    scanOrder(state, val){
      state.scanOrder = val
    }
  },
  actions: {
    ...currentPage.actions,
    ...loads.actions,
    ...timelineStore.actions
  },
  getters: {
    ...currentPage.getters,
    ...loads.getters,
    ...timelineStore.getters,
    orderScan : state => state.scanOrder
  }
}

export default storeModule