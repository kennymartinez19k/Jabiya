class EjemploService {
    constructor (http) {
      this.http = http
    }
  
    async getAll () {
     const access_token = 'b76eebca92d8d7366b94090d4d7ab47bfb202c070f43dee7a9531e26d9e20feb'
    
      const result = await this.http.get('//gorest.co.in/public/v1/users',{header : {
        'Authorization': `Bearer ${access_token}`
    }})
      return result
    }
  }
  export default EjemploService
  