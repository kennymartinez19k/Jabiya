import currentPage from '../store/currentPage'

const storeModule = {
  state: () => (
    {
      ...currentPage.state,
    }
  ),
  mutations: {
    ...currentPage.mutations,
  },
  actions: {
    ...currentPage.actions
  },
  getters: {
    ...currentPage.getters,
  }
}

export default storeModule