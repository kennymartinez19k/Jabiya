const Loads = {
    state: {
      load: {}
    },
    mutations: {
        setloadStore (state, load) {
            state.load = load
        },
    },
  
    actions: {
    },
  
    getters: {
      loadStore: state => state.load
    }
  
  }
  export default Loads
  