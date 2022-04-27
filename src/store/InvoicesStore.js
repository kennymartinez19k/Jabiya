
const InvoicesStore = {
    state: {
      invoicesId: null,
      isChangeQuantity: {
        changeQuantity: null,
        exception: false,
        order_num: null
      },
      isSelectedInvoices:null,
      invoiceDownload: {
      status: false,
      order: null
    },
      
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
        },
        getInvoiceDownload (state, value) {
          state.invoiceDownload = value
      },
     
    },
    actions:{
    
    },
  
    getters: {
        invoicesIdStore : state => state.invoicesId,
        isChangeQuantityStore : state => state.isChangeQuantity,
        isSelectedInvoicesStore : state => state.isSelectedInvoices,
        invoiceDownloadStore : state => state.invoiceDownload,
    }
  }
  
  export default InvoicesStore