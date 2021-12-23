class SingInServices {
    constructor (http) {
      this.http = http
    }
  
    async getToken (singIn) {
      localStorage.removeItem('auth');
      const result = await this.http.post('http://preprod.flai.com.do:8756/exo/authenticate', singIn)
      localStorage.setItem('auth', result.data.data.cookie[0])
      return result.data.data
    }
  }
  export default SingInServices
  