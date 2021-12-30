const SingInStore = {
    state: {
        userData: null,
    },
    mutations: {
        setUserData (state) {
            state.userData = JSON.parse(localStorage.getItem('auth'))

        },
    
    },
  
    actions: {
    },
  
    getters: {
        userData: state => state.userData,
    }
  
  }
  export default SingInStore
  