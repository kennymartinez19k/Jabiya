
class ExceptionServices {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore =  JSON.parse(localStorage.getItem('setting'));
    }
  
    async putExceptions (idException, exceptions) {
        const exception ={
            "reason": exceptions.type ,
            "note": exceptions.note
        }
        
      const result = await this.http.put(`${this.settingsLocalStore.url}/exo/orders/${idException}/exceptions`,exception)
      return result.data
    }
    async getExceptionsDetails () {
    const result = await this.http.get(`${this.settingsLocalStore.url}/exo/exceptions`)
    return result.data.reasons
  }

  }
  export default ExceptionServices
  