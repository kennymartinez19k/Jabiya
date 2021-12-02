import currentPage from '../store/currentPage'
import loads from '../store/Loads'
import timelineStore from '../store/TimelineStore'

const storeModule = {
  state: () => (
    {
      ...currentPage.state,
      ...loads.state,
      ...timelineStore.state,
      scanOrder: null,
      allOrders: [],
    }
  ),
  mutations: {
    ...currentPage.mutations,
    ...loads.mutations,
    ...timelineStore.mutations,
    scanOrder(state, val){
      state.scanOrder = val
    },
    setAllOrders(state, val){
      state.orders = val
    },
    
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
    orderScan : state => state.scanOrder,
    allOrders: state => state.orders
  }
}

export default storeModule