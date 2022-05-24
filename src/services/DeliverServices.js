import {add} from '../queue'

class deliverServices {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore
    }
  
    setURL(val){
      this.settingsLocalStore = val
    }

    async postImages (images, lat, lng ,id) {
         let form = {images, lat, lng}
         let url = this.settingsLocalStore.url+'/exo/orders/'+id+'/images'

      let token = localStorage.getItem('auth')
          let hdr = {
                 'Content-Type': 'multipart/form-data',
                 auth: token,
          }
          
          let json = {'headers': hdr,'method': 'post', 'formInfo': form, 'url': url}
          add(json)
    }

    async deliverProduct (orderId, boxId, loadCounter, productId, qrCode){
      console.log(orderId, boxId, loadCounter, productId, qrCode)
      const body = {        
        "actionName": "deliverBox",
        "params": {
          "loadScanningCounter": loadCounter,
          "boxId": boxId,
          "qrCode": qrCode
        }
      }
      const url = `${this.settingsLocalStore.url}/exo/orders/${orderId}/products/${productId}/actions`
      const json = {'method': 'post', 'url': url, 'body': body}
      add(json)
      
    }


 
  
}
  export default deliverServices
  