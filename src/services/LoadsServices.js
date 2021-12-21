
class LoadsServices {
    constructor (http) {
      this.http = http
    }

    async getLoads (data) {
      const result = await this.http.get('http://preprod.flai.com.do:8756/exo/loads/?fields=_id,shipperZone,noOfOrders,driver,shipper,loadNumber,status&date=12/10/2021', data)
      console.log(result.data, 'dddddddddddddddd')
      return result.data.filter(x => x.driver === 'Francisco  Javier')
    }
}
  export default LoadsServices
  