import {add} from '../queue'

class ExceptionServices {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore
    }
    
    setURL(val){
      this.settingsLocalStore = val
    }
  
  async putExceptions(idException, exceptions) {
      console.log(idException,exceptions,'sss')
        const exception = {
            "reason": exceptions.type ,
            "note": exceptions.note
        }
        
      let url = `${this.settingsLocalStore.url}/exo/orders/${idException}/exceptions`
      
      let json =  {'method': 'put', 'body': exception, 'url': url}

      add(json)
    }
    async getExceptionsDetails () {
    const result = await this.http.get(`${this.settingsLocalStore.url}/exo/exceptions`)
    return result.data.reasons
  }

  }
  export default ExceptionServices
  