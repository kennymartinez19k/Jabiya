
class LoadsServices {
    constructor (http) {
      this.http = http
    }

    // async getLoads () {
    //   const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/loads`)
    //   return result.data
    // }

    async getOrdersByLoadId (id) {
      const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/loads/${id}?fields=Orders`)
      return result.data.Orders
    }
    async getLoadDetails (id) {
      const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/loads/${id}`)
      // console.log(result.data, 'id   aaaa')
      return result.data
    }
    async getLoadsbyDate (date = new Date()) {
      var loadDate = new Date(date).getTime() - (new Date(date).getTime() % 86400000)
      const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/loads/?date=${loadDate}`)
      // console.log(result.data, 'dataaaa')
      return result.data
    }
}
  export default LoadsServices
  