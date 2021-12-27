
class LoadsServices {
    constructor (http) {
      this.http = http
    }

    async getLoads () {
      const result = await this.http.get('http://preprod.flai.com.do:8756/exo/loads')
      return result.data.filter(x => x.driver === 'Miguel Gonzalez')
    }

    async getLoadsbyId (id) {
      const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/loads/${id}?fields=Orders`)
      console.log(result.data, 'resultid')
      return result.data.Orders
    }
}
  export default LoadsServices
  