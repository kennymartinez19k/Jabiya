import axios from 'axios'

class deliverServices {
    constructor (http) {
      this.http = http
    }

    async postImages (images, lat, lng ,id) {
          let formData = new FormData();

         for( var i = 0; i <  images.length; i++ ){
             let file = images[i];
             const img = await fetch(file)
             const blob = await img.blob()
             formData.append('images', blob);
             console.log(formData, 'formdata')
         }
               formData.append('lat',lat);
               formData.append('lng',lng);
            let token = localStorage.getItem('auth')
          const result =  await axios.post(`http://preprod.flai.com.do:8756/exo/orders/${id}/images`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              auth: token
           },
        }
      )
      return result
    }

    async deliverProduct (orderId, boxId, loadCounter, productId, qrCode){
      const params = {
        "actionName": "deliverBox",
        "params": {
          "loadScanningCounter": loadCounter,
          "boxId": boxId,
          "qrCode": qrCode
        }
      }
      
      const result = await this.http.post(`http://preprod.flai.com.do:8756/exo/orders/${orderId}/products/${productId}/actions`, params)
      return result
    }
 
  
}
  export default deliverServices
  