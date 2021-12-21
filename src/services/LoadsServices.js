
class LoadsServices {
    constructor (http) {
      this.http = http
    }

    async getLoads (data) {
      const result = await this.http.get('http://preprod.flai.com.do:8756/exo/loads', data)
      return result.data.filter(x => x.driver === 'Miguel Gonzalez')
    }
}
  export default LoadsServices
  