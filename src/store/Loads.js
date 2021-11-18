const Loads = {
    state: {
      load: {}
    },
    mutations: {
        setloadStore (state, load) {
            state.load = load
            console.log(load, 'loadloadload')
          },
    },
  
    actions: {
    },
  
    getters: {
      loadStore: state => state.load
    }
  
  }
  export default Loads
  