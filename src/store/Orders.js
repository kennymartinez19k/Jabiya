const Orders = {
  state: {
      scanOrder: null,
      registrationForScan: null,
      settings: {
        language: null,
        profile: 'container',
        maps: false
      },
      language: null,
    }, 
  mutations: {
    scanOrder(state, val){
      state.scanOrder = val
    },
    setStructureToScan(state, val){
      state.registrationForScan = val
    },
     setSettings(state, val){
      if(val == false){
        if(localStorage.getItem('setting')){
          state.settings = JSON.parse(localStorage.getItem('setting'))
        }else 
          localStorage.setItem('setting', JSON.stringify(state.settings))
      }else{
        state.settings = val
        localStorage.setItem('setting', JSON.stringify(state.settings))
      }

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
      localStorage.setItem(name,JSON.stringify(val))
    },
    SettingStorage(state){
      if(!localStorage.getItem('setting')){
        localStorage.setItem('setting', JSON.stringify(state.state.settings))
      }
    }
  },

  getters: {
    orderScan : state => state.scanOrder,
    settingsStore: state => state.settings,
    languageStore: state => state.language,
    structureToScan: state => state.registrationForScan
  }
}

export default Orders