class LoadsServices {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore
    }

    setURL(setting){
      this.settingsLocalStore = setting
    }

    async getOrdersByLoadId (id) {
      
      const result = await this.http.get(`${this.settingsLocalStore.url}/exo/loads/${id}?fields=Orders`)
      return result.data.Orders
    }
    async getLoadDetails (id) {
      const result = await this.http.get(`${this.settingsLocalStore.url}/exo/loads/${id}`)
      var whId = result.data.warehouse
      const result2 = await this.http.get(`${this.settingsLocalStore.url}/exo/warehouses/${whId}`)
      result.data.warehouse = result2.data
      return result.data
    }
    async getLoadsbyDate (date = new Date()) {
      var loadDate = new Date(date).getTime() - (new Date(date).getTime() % 86400000)
      const result = await this.http.get(`${this.settingsLocalStore.url}/exo/loads/?date=${loadDate}`)
      return result.data
    }
    async acceptOrRejectLoad (id, version, approverId, status, type, vehicleId){
      const params = {
        "actionName": "confirmOrder",
        "params": {
            "version": version,
            "approverId":approverId,
            "status": status,
            "vehicle_id": vehicleId,
            "type": type
        }
      }
      const result = await this.http.post(`${this.settingsLocalStore.url}/exo/loads/${id}/actions`, params)
      return result
    }
    async serverStatus(){
     return await this.http.get(`${this.settingsLocalStore.url}/ping`)
    }
    
  
}
  export default LoadsServices
  