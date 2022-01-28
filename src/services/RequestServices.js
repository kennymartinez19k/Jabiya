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
          if(infoRequest.body && formData) return await this.http.post(infoRequest.url, infoRequest.body, formData, infoRequest.headers)
          else{
            if(infoRequest.body) return await this.http.post(infoRequest.url, infoRequest.body, infoRequest.headers)
            else if(formData){

              return await this.http.post(infoRequest.url, formData, infoRequest.headers)
            }
          }
        }else{
          if(infoRequest.body && formData) return await this.http.post(infoRequest.url, infoRequest.body, formData)
          else{
            if(infoRequest.body) return await this.http.post(infoRequest.url, infoRequest.body)
            else if(formData){
              return await this.http.post(infoRequest.url, formData)
            }
          }
        }
              
      }

      if (infoRequest.method === "patch") {
        if (infoRequest.headers) return await this.http.patch(infoRequest.url, infoRequest.body, infoRequest.headers)
        else return await this.http.patch(infoRequest.url, infoRequest.body)
      }
    
      if (infoRequest.method === "get") {
        if (infoRequest.headers) return await this.http.get(infoRequest.url, infoRequest.headers)
        else return await this.http.get(infoRequest.url, infoRequest.headers)
      }
      return undefined
    }
    
}
  export default RequestServices
  