const Loads = {
    state: {
      load: null,
      allLoads: [],
      loads: [],
      products:[]
    },
    mutations: {
        setloadStore (state, load) {
            state.load = load
            console.log(load)
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
    }
  
  }
  export default Loads
  