const SingInStore = {
    state: {
        userData: null,
    },
    mutations: {
        setUserData (state) {
            state.userData = JSON.parse(localStorage.getItem('userInfo'))
        },
    
    },
    getters: {
        userData: state => state.userData,
    }
  
  }
  export default SingInStore
  