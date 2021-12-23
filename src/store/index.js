import currentPage from '../store/currentPage'
import loads from '../store/Loads'
import timelineStore from '../store/TimelineStore'
import singInStore from '../store/SingInStore'

const storeModule = {
  state: () => (
    {
      ...currentPage.state,
      ...loads.state,
      ...timelineStore.state,
      ...singInStore.state,
      scanOrder: null,
      allOrders: [],
      settings: {}
    }
  ),
  mutations: {
    ...currentPage.mutations,
    ...loads.mutations,
    ...timelineStore.mutations,
    ...singInStore.mutations,
    scanOrder(state, val){
      state.scanOrder = val
    },
    setAllOrders(state, val){
      state.orders = val
    },
    setSettings(state, val){
      state.settings = val
    },
    
  },
  actions: {
    ...currentPage.actions,
    ...loads.actions,
    ...timelineStore.actions,
    ...singInStore.actions,
  },
  getters: {
    ...currentPage.getters,
    ...loads.getters,
    ...timelineStore.getters,
    ...singInStore.getters,
    orderScan : state => state.scanOrder,
    allOrders: state => state.orders,
    settings: state => state.settings
  }
}

export default storeModule