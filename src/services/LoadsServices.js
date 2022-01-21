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
      var whId = result.data.warehouse
      const result2 = await this.http.get(`http://preprod.flai.com.do:8756/exo/warehouses/${whId}`)
      result.data.warehouse = result2.data
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
      
      const result = await this.http.post(`http://preprod.flai.com.do:8756/exo/loads/${id}/actions`, params)
      return result
    }
  
}
  export default LoadsServices
  