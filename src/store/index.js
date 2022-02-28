import currentPage from '../store/currentPage'
import loads from '../store/Loads'
import timelineStore from '../store/TimelineStore'
import singInStore from '../store/SingInStore'
import orders from '../store/Orders'
import profiles from './Profiles'
import invoicesStore from './InvoicesStore'

const storeModule = {
  state: () => (
    {
      ...currentPage.state,
      ...loads.state,
      ...timelineStore.state,
      ...singInStore.state,
      ...orders.state,
      ...profiles.state,
      ...invoicesStore.state,
      profile: {
        container: true,
        
      }
    }
  ),
  mutations: {
   
    resetData(state){
      state.userData = null
        let email = localStorage.getItem('rememberData')
        let password = localStorage.getItem('rememberPassword')
        localStorage.clear()
  
        if(email && password){
          localStorage.setItem('rememberData', email)
          localStorage.setItem('rememberPassword', password)
        }
  
    },
    ...currentPage.mutations,
    ...loads.mutations,
    ...timelineStore.mutations,
    ...singInStore.mutations,
    ...orders.mutations,
    ...profiles.mutations,
    ...invoicesStore.mutations,
    
  },
  actions: {
   
    ...currentPage.actions,
    ...loads.actions,
    ...timelineStore.actions,
    ...singInStore.actions,
    ...profiles.actions,
    ...orders.actions,
    ...invoicesStore.actions,
  },
  getters: {
    ...currentPage.getters,
    ...loads.getters,
    ...timelineStore.getters,
    ...singInStore.getters,
    ...orders.getters,
    ...profiles.getters,
    ...invoicesStore.getters,

  }
}

export default storeModule