class RequestServices {
    constructor (http) {
      this.http = http
    }
    async request (infoRequest) {

      let formData = new FormData();


      if(infoRequest.formInfo){
        const {images, lng, lat } = infoRequest.formInfo
           let file = null
          for( var i = 0; i <  images.length; i++ ){
               file = images[i];
              let img = await fetch(file)
              let blob = await img.blob()
              let name = `item ${i}`
              formData.append('images', blob, name);
          }
                formData.append('lat',lat);
                formData.append('lng',lng);

      }
        
      if (infoRequest.method === "post") {
        if (infoRequest.headers){
          if(infoRequest.body && formData){
            let res = await this.http.post(infoRequest.url, infoRequest.body, formData, infoRequest.headers)
            return res
          }
          else{
            if(infoRequest.body) {
              let res = await this.http.post(infoRequest.url, infoRequest.body, infoRequest.headers)
              return res
            }
            else if(formData){
              let res = await this.http.post(infoRequest.url, formData, infoRequest.headers)
              return res
            }
          }
        }else{
          if(infoRequest.body && formData){
            let res = await this.http.post(infoRequest.url, infoRequest.body, formData)
            return res
          }
          else{
            if(infoRequest.body){
              let res = await this.http.post(infoRequest.url, infoRequest.body)
              return res
            } 
            else if(formData){
              let res = await this.http.post(infoRequest.url, formData)
              return res

            }
          }
        }
              
      }

      if (infoRequest.method === "patch") {

        if (infoRequest.headers)  {
          let res = await this.http.patch(infoRequest.url, infoRequest.body, infoRequest.headers)
          return res

        }
        else {
          let res = await this.http.patch(infoRequest.url, infoRequest.body)
          return res
        }
      }
    
      if (infoRequest.method === "get") {
        if (infoRequest.headers) {
          let res = await this.http.get(infoRequest.url, infoRequest.headers)
          return res
        }
        else {
          let res = await this.http.get(infoRequest.url, infoRequest.headers)
          return res

        }
      }

      if (infoRequest.method === "put") {

        if (infoRequest.headers)  {
          let res = await this.http.put(infoRequest.url, infoRequest.body, infoRequest.headers)
          return res

        }
        else {
          let res = await this.http.put(infoRequest.url, infoRequest.body)
          return res
        }
      }
    
      return undefined
    }
    
}
  export default RequestServices
  