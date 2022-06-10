  
class DriverVehicleAssignment {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore
    }

    
    setURL(val){
      this.settingsLocalStore = val
    }
  
    async getDriverAndVehicle (loadId) {
      let result = {}
      try{
        result = await this.http.get(`${this.settingsLocalStore.url}/exo/loads/${loadId}/availableTransports`)
      }catch(error){
        console.log(error.message)
      }
      return result.data
    }

    async postDriverVehicleAssignment (loadId, idValues) {
      let result = {}
      try{
        result = await this.http.post(`${this.settingsLocalStore.url}/exo/loads/${loadId}/drivers`, idValues)
      }catch(error){
        console.log(error)
      }
      return result
    }

  }
  export default DriverVehicleAssignment
  