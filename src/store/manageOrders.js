const listOrders = {
    state: {
      listOrders: null,
      order: null
     
    },
    mutations: {
        setListOrders (state, orders) {
            state.listOrders = orders
        },
        editOrder(state, order){
          state.order = order
        }
        
    },
    getters: {
      listOrdersStore: state => state.listOrders,
      orderManageStore: state => state.order
    }
  
  }
  export default listOrders
  