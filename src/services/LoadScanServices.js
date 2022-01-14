
class LoadsScanServices {
    constructor (http) {
      this.http = http
    }

    async driverArrival (loadId) {
      const params = {
        "actionName": "driverArrival",
        "params": {
          "statusType": "Arrival",   
        }
      }
      const result = await this.http.post(`http://preprod.flai.com.do:8756/exo/loads/${loadId}/actions`, params)
      return result.data
    }

    async getProduct(orderId){    
      const result = await this.http.get(`http://preprod.flai.com.do:8756/exo/orders/${orderId}/products`)
      return result.data
    }

    async scanProduct (orderId, boxId, loadCounter, productId, qrCode){
      const params = {
        "actionName": "loadBox",
        "params": {
          "loadScanningCounter": loadCounter,
          "boxId": boxId,
          "qrCode": qrCode
        }
      }
      
      const result = await this.http.post(`http://preprod.flai.com.do:8756/exo/orders/${orderId}/products/${productId}/actions`, params)
      console.log(result)
      return result
    }

    async completeLoad(loadId, loadQuantity){
      console.log(loadId, loadQuantity)
      const params = {
        "actionName": "completeLoadProcess",
        "params": {
          "loadFractionNumber": `${loadQuantity}/${loadQuantity} `
          
        }
      }
      const result = await this.http.post(`http://preprod.flai.com.do:8756/exo/loads/${loadId}/actions`, params)
      console.log(result)
      return result
    }
  
}
  export default LoadsScanServices
  