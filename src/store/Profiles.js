
const profiles = {
    state: {
        rol: 'admin',
        permissions: {
            'admin': ['sendInfo', 'saveInfo'],
            'mar': ['saveInfo'],
        }
    },
    mutations: {
        changeRol(state, rol) {
            console.log(rol)
          state.rol = rol
        }
    },
    actions:{
        hasPermission(){
            return true
        }
    },
  
    getters: {
      
    }
  }
  
  export default profiles