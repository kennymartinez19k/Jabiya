class LoadsScanServices {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore
    }
    
    setURL(val){
      this.settingsLocalStore = val
    }

    async driverArrival (loadId) {
      const params = {
        "actionName": "driverArrival",
        "params": {
          "statusType": "Arrival",   
        }
      }
      await this.http.post(`${this.settingsLocalStore.url}/exo/loads/${loadId}/actions`, params)

    }

    async getProduct(orderId){    
      const result = await this.http.get(`${this.settingsLocalStore.url}/exo/orders/${orderId}/products`)
      return result.data
    }

  async scanProduct(orderId, boxId, loadCounter, productId, qrCode) {
        const params = {
          "actionName": "loadBox",
          "params": {
            "loadScanningCounter": loadCounter,
            "boxId": boxId,
            "qrCode": qrCode
          }
        }
        
        const result = await this.http.post(`${this.settingsLocalStore.url}/exo/orders/${orderId}/products/${productId}/actions`, params)
        return result
    }

    async completeLoad(loadId, loadQuantity){
      const params = {
        "actionName": "completeLoadProcess",
        "params": {
          "loadFractionNumber": `${loadQuantity}/${loadQuantity} `
          
        }
      }
      const result = await this.http.post(`${this.settingsLocalStore.url}/exo/loads/${loadId}/actions`, params)
      return result
    }
  
}
  export default LoadsScanServices
  