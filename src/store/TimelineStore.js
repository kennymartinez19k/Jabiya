const TimelineStore = {
    state: {
        textException: null,
        digitalFirm: null,
    },
    mutations: {
        setTextException (state, exception) {
            state.textException = exception
        },
        setDigitalFirm (state, firm) {
            state.digitalFirm = firm
        },
    },
  
    actions: {
    },
  
    getters: {
        exceptionStore: state => state.textException,
        digitalFirmStore: state => state.digitalFirm
    }
  
  }
  export default TimelineStore
  