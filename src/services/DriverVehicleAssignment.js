  
class DriverVehicleAssignment {
    constructor (http) {
      this.http = http
    }
  
    async getDriverAndVehicle (loadId) {
      const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/loads/${loadId}/availableTransports`)
      return result.data
    }

    async postDriverVehicleAssignment (loadId, idValues) {
      const result = await this.http.post(`http://preprod.flai.com.do:8756/exo/loads/${loadId}/drivers`, idValues)
      return result
    }

   
  }
  export default DriverVehicleAssignment
  