const Loads = {
    state: {
      load: null,
      allLoadsStore: [],
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
        setloadProductStore (state, products) {
          state.products = products
      },
    },
    actions:{
      setData({commit}, val){
        commit('setloadStore', val)
       
      },
   
    },
    getters: {
      loadStore: state => state.load,
      allLoadsStore: state => state.allLoadsStore,
      products: state => state.products,
      startRoute: state => state.startRoute,
      detailsLoadsStore: state => state.detailsLoads
    }
  
  }
  export default Loads
  