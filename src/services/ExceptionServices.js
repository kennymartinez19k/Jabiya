import {add} from '../queue'

class ExceptionServices {
    constructor (http) {
      this.http = http
    }
  
    async putExceptions (idException, exceptions) {
        const exception ={
            "reason": exceptions.type ,
            "note": exceptions.note
        }
        
      let url = `http://preprod.flai.com.do:8756/exo/orders/${idException}/exceptions`
      
      let json =  {'method': 'put', 'body': exception, 'url': url}

      add(json)
    }
    async getExceptionsDetails () {
    const result = await this.http.get('http://preprod.flai.com.do:8756/exo/exceptions')
    return result.data.reasons
  }

  }
  export default ExceptionServices
  