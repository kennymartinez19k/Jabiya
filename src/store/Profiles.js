
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
        hasPermission({state}, permission){
            debugger // eslint-disable-line
            var a = state.permissions[state.rol].some(p => p == permission)
            console.log(a)
            return a
        }
    },
  
    getters: {
      
    }
  }
  
  export default profiles