
const profiles = {
    state: {
        rol: 'container',
        permissions: {
            'container': ['autoScan', 'saveInfo'],
            'otro': ['noAutoScan'],
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
            // debugger // eslint-disable-line
            var a = state.permissions[state.rol].some(p => p === permission)
            console.log(a)
            return a
        }
    },
  
    getters: {
      rolStore : state => state.rol
    }
  }
  
  export default profiles