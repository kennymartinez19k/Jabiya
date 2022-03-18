// import {add} from '../queue'

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
      // let url = `${this.settingsLocalStore.url}/exo/loads/${loadId}/actions` 
      // let json = {'method': 'post', 'body': params, 'url': url}

      const result = await this.http.post(`${this.settingsLocalStore.url}/exo/loads/${loadId}/actions`, params)
      console.log(result)

    }

    async getProduct(orderId){    
      const result = await this.http.get(`${this.settingsLocalStore.url}/exo/orders/${orderId}/products`)
      return result.data
    }

    async scanProduct (orderId, boxId, loadCounter, productId, qrCode){
      // console.log(orderId, boxId, loadCounter, productId, qrCode)
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
  