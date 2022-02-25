const Orders = {
  state: {
      scanOrder: null,
      registrationForScan: null,
      imagesStructure: null,
      orderDetails: [],
    }, 
  mutations: {
    scanOrder(state, val){
      state.scanOrder = val
    },
    setStructureToScan(state, val){
      state.registrationForScan = val
    },
    
    setOrderDetails(state, val){
      state.orderDetails = val
    }, 
    setImagiElement(state, val){
      state.imagesStructure = val
    }
  },
  actions:{
    changeLoadScannedInStore({commit}, val){
      commit('setStructureToScan', val)
      let name = JSON.stringify(val.name)
      localStorage.setItem(name,JSON.stringify(val))
    },
 
  },

  getters: {
    orderScan : state => state.scanOrder,
    languageStore: state => state.language,
    structureToScan: state => state.registrationForScan,
    orderDetailsStore: state => state.orderDetails,
    imagesStore: state => state.imagesStructure
  }
}

export default Orders