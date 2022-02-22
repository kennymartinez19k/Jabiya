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
      localStorage.clear()
      localStorage.removeItem("dateCheck")
      localStorage.removeItem('userInfo')
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