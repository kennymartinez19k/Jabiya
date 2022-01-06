const SingInStore = {
    state: {
        userData: null,
    },
    mutations: {
        setUserData (state, user) {
            state.userData = user
        },
    
    },
  
    actions: {
    },
  
    getters: {
        userData: state => state.userData,
    }
  
  }
  export default SingInStore
  