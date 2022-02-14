const TimelineStore = {
    state: {
        textException: null,
        digitalFirm: null,
        exceptions: null
    },
    mutations: {
        setTextException (state, exception) {
            state.textException = exception
        },
        setExceptions (state, exception) {
            state.exceptions = exception
        },
        setDigitalFirm (state, firm) {
            state.digitalFirm = firm
        },
    },
  
    actions: {
    },
  
    getters: {
        exceptionStore: state => state.textException,
        causeExceptionsStore: state => state.exceptions,
        digitalFirmStore: state => state.digitalFirm
    }
  
  }
  export default TimelineStore
  