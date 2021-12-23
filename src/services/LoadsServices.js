
class LoadsServices {
    constructor (http) {
      this.http = http
    }

    async getLoads () {
      const result = await this.http.get('http://preprod.flai.com.do:8756/exo/loads')
      return result.data.filter(x => x.driver === 'Miguel Gonzalez')
    }

    async getLoadsbyId (idOrders) {
      const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/loads/${idOrders}?fields=Orders`)
      console.log(result, 'resultid')
      return result.data.Orders[0].products
    }
}
  export default LoadsServices
  