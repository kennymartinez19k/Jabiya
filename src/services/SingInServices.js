class SingInServices {
    constructor (http) {
      this.http = http
    }
  
    async getToken (signIn) {
      localStorage.removeItem('auth');
      const result = await this.http.post('http://preprod.flai.com.do:8756/exo/authenticate', signIn)
      localStorage.setItem('auth', JSON.stringify(result.data.data));
      return result.data.data
    }
  }
  export default SingInServices
  