
const InvoicesStore = {
    state: {
      invoicesId: null,
      isChangeQuantity: {
        changeQuantity: null,
        exception: false,
      },
      isSelectedInvoices:null
    },
    mutations: {
        getOrdersToInvoicesId (state, value) {
          state.invoicesId = value
          // console.log( state.invoicesId, ' state.invoicesId')
        },
        getChageQuantityToProduct (state, value) {
          state.isChangeQuantity = value
          // console.log( state.isChangeQuantity.changeQuantity, ' state.invoicesId')
        },
        getSelectedInvoices (state, value) {
          state.isSelectedInvoices = value
          // console.log( state.isSelectedInvoices.changeQuantity, ' state.isSelectedInvoices')
        }
    },
    actions:{
    
    },
  
    getters: {
        invoicesIdStore : state => state.invoicesId,
        isChangeQuantityStore : state => state.isChangeQuantity,
        isSelectedInvoicesStore : state => state.isSelectedInvoices,
    }
  }
  
  export default InvoicesStore