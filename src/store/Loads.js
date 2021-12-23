const Loads = {
    state: {
      load: null,
      allLoads: [],
      loads: []
    },
    mutations: {
        setloadStore (state, load) {
            state.load = load
        },
        setAllLoads(state, val){
          state.allLoads = val
        },
        chargeLoads(state, val){
          state.loads = val
        }
    },
    getters: {
      loadStore: state => state.load,
      allLoads: state => state.allLoads,
      loads: state => state.loads
    }
  
  }
  export default Loads
  