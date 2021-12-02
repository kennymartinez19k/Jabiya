const Loads = {
    state: {
      load: {},
      allLoads: []
    },
    mutations: {
        setloadStore (state, load) {
            state.load = load
        },
        setAllLoads(state, val){
          state.allLoads = val
        },
        
    },
  
    actions: {
    },
  
    getters: {
      loadStore: state => state.load,
      allLoads: state => state.allLoads
    }
  
  }
  export default Loads
  