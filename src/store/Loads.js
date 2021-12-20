import services from '../services'
const Loads = {
    state: {
      load: {},
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
  
    actions: {
      async changeDateLoads({commit}){

        const loads = await services.loadsServices.getLoads()
        console.log(loads)
        commit('chargeLoads', loads)
      }
    },
  
    getters: {
      loadStore: state => state.load,
      allLoads: state => state.allLoads,
      loads: state => state.loads
    }
  
  }
  export default Loads
  