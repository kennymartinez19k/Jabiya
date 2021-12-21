// import axios from 'axios'
class SingInServices {
    constructor (http) {
      this.http = http
    }
  
    async getToken (singIn) {
    
      const result = await this.http.post('http://preprod.flai.com.do:8756/exo/authenticate', singIn)
      console.log(result.data.data, 'result.data')
      
      return result.data.data[0]
    }
  }
  export default SingInServices
  