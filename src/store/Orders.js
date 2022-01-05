// import i18n from '../i18n'
const orders = {
  state: {
      scanOrder: null,
      allOrders: [],
      settings: {
        AutoScan: true
      },
      language: null,
    },
  mutations: {
    scanOrder(state, val){
      state.scanOrder = val
    },
    setAllOrders(state, val){
      state.orders = val
    },
    setSettings(state, val){
      state.settings = val
    },
    setLanguageStore (state, lang) {
      state.language = lang
     console.log(lang, 'sdoiooo')
    }    
  },

  getters: {
    orderScan : state => state.scanOrder,
    allOrders: state => state.orders,
    settingsStore: state => state.settings,
    languageStore: state => state.language
  }
}

export default orders