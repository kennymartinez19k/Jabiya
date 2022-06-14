
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
    summaryInvoice: {
      orderId :  null,
      summarys: []
    },
    invoiceDetails:{}
      
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
      getSummaryInvoice (state, value) {
        state.summaryInvoice = value
      },
      getInvoiceDetails (state, value) {
        state.invoiceDetails = value
      },
      
        
     
    },
    actions:{
    
    },
  
    getters: {
        invoicesIdStore : state => state.invoicesId,
        isChangeQuantityStore : state => state.isChangeQuantity,
        isSelectedInvoicesStore : state => state.isSelectedInvoices,
        invoiceDownloadStore : state => state.invoiceDownload,
        summaryInvoiceStore : state => state.summaryInvoice,
        invoiceDetailsStore : state => state.invoiceDetails,
    }
  }
  
  export default InvoicesStore