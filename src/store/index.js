import currentPage from '../store/currentPage'
import loads from '../store/Loads'
import timelineStore from '../store/TimelineStore'
import singInStore from '../store/SingInStore'
import orders from '../store/Orders'
import profiles from './Profiles'
import invoicesStore from './InvoicesStore'
import manageOrders from './manageOrders'

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
      ...manageOrders.state,
      profile: {
        container: true,   
      },
      isQueueEmpty: false,
      isRequestError: false
    }
  ),
  mutations: {
   
    resetData(state){
      state.userData = null
        let email = localStorage.getItem('rememberData')
        let password = localStorage.getItem('rememberPassword')
        let setting = JSON.parse(localStorage.getItem('setting'))
        localStorage.clear()
  
        if(email && password){
          localStorage.setItem('rememberData', email)
          localStorage.setItem('rememberPassword', password)
          localStorage.setItem('setting', JSON.stringify(setting))
        }
  
    },
    changeQueueStatus(state, val){
      state.isQueueEmpty = val
    },
    changeRequestStatus(state, val){
      state.isRequestError = val
    },
    ...currentPage.mutations,
    ...loads.mutations,
    ...timelineStore.mutations,
    ...singInStore.mutations,
    ...orders.mutations,
    ...profiles.mutations,
    ...invoicesStore.mutations,
    ...manageOrders.mutations
    
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
    ...manageOrders.getters,

    isQueueEmpty: state => state.isQueueEmpty,
    isRequestError: state => state.isRequestError


  }
}

export default storeModule