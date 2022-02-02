const profiles = {
    state: {
        settings: {
            // AutoScan: true,
            language: null,
            profile: 'container',
            maps: false,
        },
    
    },
    mutations: {
   
        async setSettings(state, val){
            if(!val){
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
            console.log(name)
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
    }
  }
  
  export default profiles