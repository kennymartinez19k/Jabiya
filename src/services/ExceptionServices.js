
class ExceptionServices {
    constructor (http) {
      this.http = http
    }
  
    async setExceptions (idException, exceptions) {
        const exception ={
            "reason": exceptions.type ,
            "note": exceptions.note
        }
        
      const result = await this.http.put(`http://preprod.flai.com.do:8756/exo/orders/${idException}/exceptions`,exception)
      return result.data
    }

  }
  export default ExceptionServices
  