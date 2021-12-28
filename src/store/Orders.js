
const orders = {
  state: {
      scanOrder: null,
      allOrders: [],
      settings: {
        AutoScan: true
      }
    },
  mutations: {
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

  getters: {
    orderScan : state => state.scanOrder,
    allOrders: state => state.orders,
    settings: state => state.settings
  }
}

export default orders