class LoadsServices {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore
    }

    setURL(setting){
      this.settingsLocalStore = setting
    }

    async getOrdersByLoadId (id) {
      let result = {}
      try{
        result = await this.http.get(`${this.settingsLocalStore.url}/exo/loads/${id}?fields=Orders`)
      }catch(error){
        console.log(error.message)
      }
      return result.data.Orders
    }

    async getLoadDetails (id) {
      let result = null
      let res = null
      try{
        result = await this.http.get(`${this.settingsLocalStore.url}/exo/loads/${id}`)
        let whId = result.data.warehouse
        res = await this.http.get(`${this.settingsLocalStore.url}/exo/warehouses/${whId}`)
        result.data.warehouse = res.data
      }catch(error){
        console.log(error.message)
      }
      return result.data
    }

    async getLoadsbyDate (date = new Date()) {
      var loadDate = new Date(date).getTime() - (new Date(date).getTime() % 86400000)
      let result = {}
      try{
        result = await this.http.get(`${this.settingsLocalStore.url}/exo/loads/?date=${loadDate}`)
      }catch(error){
        console.log(error.message)
      }
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
      let result = {}
      try{
        result = await this.http.post(`${this.settingsLocalStore.url}/exo/loads/${id}/actions`, params)
      }catch(error){
        console.log(error.message)
      }
      return result
    }
    async serverStatus(){
     return await this.http.get(`${this.settingsLocalStore.url}/ping`)
    }
    
  
}
  export default LoadsServices
  