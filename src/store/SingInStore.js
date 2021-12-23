const SingInStore = {
    state: {
        userData: null,
    },
    mutations: {
        setUserData (state, user) {
            state.userData = user
            // console.log(state.userData, 'ssssssss')
        },
    
    },
  
    actions: {
    },
  
    getters: {
        userData: state => state.userData,
    }
  
  }
  export default SingInStore
  