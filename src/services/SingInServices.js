// import store from '../store/index'
class SingInServices {
    constructor (http) {
      this.http = http
    }
  
    async getToken (singIn) {
      localStorage.removeItem('auth');
      const result = await this.http.post('http://preprod.flai.com.do:8756/exo/authenticate', singIn)
      // console.log(result.data.data[0], 'result.data')
      localStorage.setItem('auth', result.data.data[0])
      return result.data.data[0]
    }
  }
  export default SingInServices
  