
const InvoicesStore = {
    state: {
      invoicesId: null,
      isChangeQuantity: {
        changeQuantity: null,
        exception: false,
        order_num: null
      },
      isSelectedInvoices:null
    },
    mutations: {
        getOrdersToInvoicesId (state, value) {
          state.invoicesId = value
        },
        getChageQuantityToProduct (state, value) {
          state.isChangeQuantity = value
        },
        getSelectedInvoices (state, value) {
          state.isSelectedInvoices = value
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