const profiles = {
    state: {
        settings: {
            maps: false,
            url: null
        },
        server: false
    },
    mutations: {
   
        async setSettings(state, val){
            if(!val){
              state.settings = JSON.parse(localStorage.getItem('setting'))
              localStorage.setItem('setting', JSON.stringify(state.settings))
            }else{
              state.settings = val
              localStorage.setItem('setting', JSON.stringify(state.settings))
            }
      
        },
        setLanguageStore (state, lang) {
          state.language = lang
        },
        setServer(state, val){
          state.server = val
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
      settingsStore: state => state.settings,
      languageStore: state => state.language,
      server: state => state.server
    }
  }
  
  export default profiles