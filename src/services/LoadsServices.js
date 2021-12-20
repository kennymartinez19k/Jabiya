class LoadsServices {
    constructor (http) {
      this.http = http
    }
  
    async getLoads () {
    
      const result = await this.http.get('http://preprod.flai.com.do:8756/exo/loads')
      console.log(result.data)
      return result.data.filter(x => x.driver === 'Miguel Gonzalez')
    }
  }
  export default LoadsServices
  