  
class DriverVehicleAssignment {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore
    }

    
    setURL(val){
      this.settingsLocalStore = val
    }
  
    async getDriverAndVehicle (loadId) {
      const result = await this.http.get(`${this.settingsLocalStore.url}/exo/loads/${loadId}/availableTransports`)
      return result.data
    }

    async postDriverVehicleAssignment (loadId, idValues) {
      const result = await this.http.post(`${this.settingsLocalStore.url}/exo/loads/${loadId}/drivers`, idValues)
      return result
    }

   
  }
  export default DriverVehicleAssignment
  