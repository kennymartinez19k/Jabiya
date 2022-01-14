const Loads = {
    state: {
      load: null,
      allLoads: [],
      loads: [],
      products:[],
      startRoute: true,
      finishDelivered: 0

    },
    mutations: {
        setloadStore (state, load) {
            state.load = load
        },
        finishDelivered(state, load){
          state.finishDelivered = load
        },
        setStartRoute(state, startRoute){
          state.startRoute = startRoute
        },
        setAllLoads(state, val){
          state.allLoads = val
        },
        chargeLoads(state, val){
          state.loads = val
        },
        setloadProductStore (state, products) {
          state.products = products
      },
    },
    getters: {
      loadStore: state => state.load,
      allLoads: state => state.allLoads,
      loads: state => state.loads,
      products: state => state.products,
      startRoute: state => state.startRoute,
      finishDelivered: state => state.finishDelivered
    }
  
  }
  export default Loads
  