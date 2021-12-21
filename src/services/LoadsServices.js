
class LoadsServices {
    constructor (http) {
      this.http = http
    }

    async getLoads (data) {
      const result = await this.http.get('http://preprod.flai.com.do:8756/exo/loads/', data)
      console.log(result.data, 'dddddddddddddddd')
      return result.data.filter(x => x.driver === 'Francisco  Javier')
    }
}
  export default LoadsServices
  