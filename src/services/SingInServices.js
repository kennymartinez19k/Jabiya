import axios from 'axios'
class SingInServices {
    constructor (http) {
      this.http = http
    }
    // setToken (token) {
    //     this.headers = {
    //       Authorization: `Token ${token || ''}`
    //     }
    //   }
    //   getToken (data) { 
    //     return http.post('/auth/login', data)
    //   },
  
    async getToken (singIn) {
    
      const result = await this.http.post('http://preprod.flai.com.do:8756/exo/authenticate', singIn)
      console.log(result.data.data, 'result.data')
      axios.defaults.headers.common['Cookie'] = `Bearer ${result.data.data[0]}`
      
      return result.data.data[0]
    }
  }
  export default SingInServices
  