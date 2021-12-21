const currentPage = {
    state: {
      current: {}
    },
    mutations: {
        setCurrent (state, current) {
            state.current = current
          },
    },
  
    actions: {
    },
  
    getters: {
      current: state => state.current
    }
  
  }
  export default currentPage
  