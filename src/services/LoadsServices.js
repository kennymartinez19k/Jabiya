class LoadsServices {
    constructor (http) {
      this.http = http
    }
  
    async getLoads () {
    
      const result = await this.http.get('http://preprod.flai.com.do:8756/exo/loads')
      console.log(result, 'loads services')
      return result
    }
  }
  export default LoadsServices
  