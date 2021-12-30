
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
      return result.data
    }
    async getLoadsbyDate (date = new Date()) {
      var loadDate = new Date(date).getTime() - (new Date(date).getTime() % 86400000)
      const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/loads/?date=${loadDate}`)
      return result.data
    }
    async acceptOrRejectLoad (id, version, status){
      const params = {
        "actionName": "confirmOrder",
        "params": {
            "version": version,
            "approverId":"61a8e3254395b54b0da5aa9f",
            "status": status
        }
      }
      const result = await this.http.patch(`http://preprod.flai.com.do:8756/exo/loads/${id}/actions`, params)
      return result
    }
  
}
  export default LoadsServices
  