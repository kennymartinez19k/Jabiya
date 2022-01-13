const orders = {
  state: {
      scanOrder: null,
      registrationForScan: null,
      settings: {
        AutoScan: true
      },
      language: null,
    },
  mutations: {
    scanOrder(state, val){
      state.scanOrder = val
    },
    setStructureToScan(state, val){
      state.registrationForScan = val
      console.log(state.registrationForScan)
    },
    setSettings(state, val){
      state.settings = val
    },
    setLanguageStore (state, lang) {
      state.language = lang
     console.log(lang)
    }    
  },
  actions:{
    changeLoadScannedInStore({commit}, val){
      commit('setStructureToScan', val)
      let name = JSON.stringify(val.name)
      console.log(name)
      localStorage.setItem(name,JSON.stringify(val))
    }
  },

  getters: {
    orderScan : state => state.scanOrder,
    settingsStore: state => state.settings,
    languageStore: state => state.language,
    structureToScan: state => state.registrationForScan
  }
}

export default orders