
const InvoicesStore = {
    state: {
      invoicesId: null
    },
    mutations: {
        getOrdersToInvoicesId (state, value) {
            console.log(value)
          state.invoicesId = value
          console.log( state.invoicesId, ' state.invoicesId')
        }
    },
    actions:{
    
    },
  
    getters: {
        invoicesIdStore : state => state.invoicesId
    }
  }
  
  export default InvoicesStore