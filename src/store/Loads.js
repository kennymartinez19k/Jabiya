const Loads = {
    state: {
      load: null,
      allLoadsStore: [],
      loads: [],
      products:[],
      startRoute: true,
      detailsLoads:[],
    },
    mutations: {
        setloadStore (state, load) {
            state.load = load
        },
       
        setStartRoute(state, startRoute){
          state.startRoute = startRoute
        },
        setAllLoadStore(state, val){
          state.allLoadsStore = val
        },
        setDetailsLoadsStore(state, val){
          state.detailsLoads = val
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
      allLoadsStore: state => state.allLoadsStore,
      loads: state => state.loads,
      products: state => state.products,
      startRoute: state => state.startRoute,
      detailsLoadsStore: state => state.detailsLoads
    }
  
  }
  export default Loads
  