
class LoadsServices {
    constructor (http) {
      this.http = http
    }

    async getLoads () {
      var today = new Date().getTime() - (new Date().getTime() % 86400000)
      const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/loads/?date=${today}`)
      return result.data
    }

    async getLoadsbyId (id) {
      const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/loads/${id}?fields=Orders`)
      return result.data.Orders
    }
    async getLoadsbyDate (date) {
      var loadDate = new Date(date).getTime() - (new Date(date).getTime() % 86400000)
      const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/loads/?date=${loadDate}`)
      console.log(result)
      return result.data
    }
}
  export default LoadsServices
  