
class LoadsServices {
    constructor (http) {
      this.http = http
    }

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
    async acceptOrRejectLoad (id, version, approverId, status){
      const params = {
        "actionName": "confirmOrder",
        "params": {
            "version": version,
            "approverId":approverId,
            "status": status
        }
      }
      const result = await this.http.patch(`http://preprod.flai.com.do:8756/exo/loads/${id}/actions`, params)
      return result
    }
  
}
  export default LoadsServices
  