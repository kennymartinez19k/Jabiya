class LoadsServices {
    constructor (http) {
      this.http = http
    }
  
    async getLoads () {
    
      const result = await this.http.get('http://preprod.flai.com.do:8756/exo/loads')
      return result.data.filter(x => x.driver === 'Francisco  Javier')
    }
  }
  export default LoadsServices
  