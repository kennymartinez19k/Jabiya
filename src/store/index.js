import currentPage from '../store/currentPage'
import loads from '../store/Loads'
import timelineStore from '../store/TimelineStore'
import singInStore from '../store/SingInStore'
import orders from '../store/Orders'
import profiles from './Profiles'

const storeModule = {
  state: () => (
    {
      ...currentPage.state,
      ...loads.state,
      ...timelineStore.state,
      ...singInStore.state,
      ...orders.state,
      ...profiles.state
    }
  ),
  mutations: {
    ...currentPage.mutations,
    ...loads.mutations,
    ...timelineStore.mutations,
    ...singInStore.mutations,
    ...orders.mutations,
    ...profiles.mutations
    
  },
  actions: {
    ...currentPage.actions,
    ...loads.actions,
    ...timelineStore.actions,
    ...singInStore.actions,
    ...profiles.actions
  },
  getters: {
    ...currentPage.getters,
    ...loads.getters,
    ...timelineStore.getters,
    ...singInStore.getters,
    ...orders.getters,
    ...profiles.getters

  }
}

export default storeModule