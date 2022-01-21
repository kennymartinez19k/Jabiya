import {add} from '../queue'



class deliverServices {
    constructor (http) {
      this.http = http
    }

    async postImages (images, lat, lng ,id) {
         
         let form = {images, lat, lng}
         let url = 'http://preprod.flai.com.do:8756/exo/orders/'+id+'/images'

         let token = localStorage.getItem('auth')
          let hdr = {
                 'Content-Type': 'multipart/form-data',
                 auth: token,
          }
          
          let json = {'headers': hdr,'method': 'post', 'formInfo': form, 'url': url}
          add(json)


          // const result =  await this.http.post(url, formData, hdr)
          // console.log(url, formData, headers, callback)
          // this.http.post(url, formData, headers, callback)

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
      const url = `http://preprod.flai.com.do:8756/exo/orders/${orderId}/products/${productId}/actions`
      
      const json = {'method': 'post', 'url': url, 'body': body}
      add(json)
      
      // let result = await this.http.post(url, params)
      // console.log(result)

      // this.http.post(url, json, null, callback)
      // console.log(url, params, null, callback)    
      // this.http.post(url, params, null, callback)
      
    }
 
  
}
  export default deliverServices
  