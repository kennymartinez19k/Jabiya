class RequestServices {
    constructor (http) {
      this.http = http
    }
    async request (infoRequest) {

      console.log(infoRequest)
      
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
    try{
        
      if (infoRequest.method === "post") {
        // localStorage.setItem('posts', localStorage.getItem('posts') + 1)
        if (infoRequest.headers){
          if(infoRequest.body && formData){
            let res = await this.http.post(infoRequest.url, infoRequest.body, formData, infoRequest.headers)
            // // localStorage.setItem('posts', localStorage.getItem('posts') - 1)
            return res
          }
          else{
            if(infoRequest.body) {
              let res = await this.http.post(infoRequest.url, infoRequest.body, infoRequest.headers)
              // localStorage.setItem('posts', localStorage.getItem('posts') - 1)
              return res
            }
            else if(formData){
              let res = await this.http.post(infoRequest.url, formData, infoRequest.headers)
              // // localStorage.setItem('posts', localStorage.getItem('posts') - 1)
              return res
            }
          }
        }else{
          if(infoRequest.body && formData){
            let res = await this.http.post(infoRequest.url, infoRequest.body, formData)
            // // localStorage.setItem('posts', localStorage.getItem('posts') - 1)
            return res
          }
          else{
            if(infoRequest.body){
              let res = await this.http.post(infoRequest.url, infoRequest.body)
              // // localStorage.setItem('posts', localStorage.getItem('posts') - 1)
              return res
            } 
            else if(formData){
              let res = await this.http.post(infoRequest.url, formData)
              // // localStorage.setItem('posts', localStorage.getItem('posts') - 1)
              return res

            }
          }
        }
              
      }

      if (infoRequest.method === "patch") {
        // // localStorage.setItem('patches', localStorage.getItem('patches') + 1)

        if (infoRequest.headers)  {
          let res = await this.http.patch(infoRequest.url, infoRequest.body, infoRequest.headers)
          // // localStorage.setItem('patches', localStorage.getItem('patches') - 1)
          return res

        }
        else {
          let res = await this.http.patch(infoRequest.url, infoRequest.body)
          // // localStorage.setItem('patches', localStorage.getItem('patches') - 1)
          return res
        }
      }
    
      if (infoRequest.method === "get") {
        // // localStorage.setItem('gets', localStorage.getItem('gets') + 1)
        if (infoRequest.headers) {
          let res = await this.http.get(infoRequest.url, infoRequest.headers)
          // // localStorage.setItem('gets', localStorage.getItem('gets') - 1)
          return res
        }
        else {
          let res = await this.http.get(infoRequest.url, infoRequest.headers)
          // // localStorage.setItem('gets', localStorage.getItem('gets') - 1)
          return res

        }
      }

      if (infoRequest.method === "put") {
        // // localStorage.setItem('patches', localStorage.getItem('patches') + 1)

        if (infoRequest.headers)  {
          let res = await this.http.put(infoRequest.url, infoRequest.body, infoRequest.headers)
          // // localStorage.setItem('patches', localStorage.getItem('patches') - 1)
          return res

        }
        else {
          let res = await this.http.put(infoRequest.url, infoRequest.body)
          // // localStorage.setItem('patches', localStorage.getItem('patches') - 1)
          return res
        }
      }
    }catch(error){
      return false
    }
      return undefined
    }
    
}
  export default RequestServices
  