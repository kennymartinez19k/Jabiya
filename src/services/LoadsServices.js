
class LoadsServices {
    constructor (http) {
      this.http = http
    }
  async getHeaders () {
    const token = `connect.sid=s%3ABR94OXNkBmkRIThnYWMc1H5PZ_2djah5.gFYxhod25z18n9Gte%2B4gj7XtNP8HDDcrr6ZWkWFWqRU; Path=/; Expires=Sat, 18 Dec 2021 03:06:07 GMT; HttpOnly`
    if (token == null) {
      this.toast.open({ message: 'Problemas al realizar la operación', type: 'error' })
      console.error('El token no ha sido suministrado')
      return null
    }

    const headers = {
      'Cookie': token
    }

    return {
      headers: headers
    }
  }
    async getLoads () {
  

     if (this.getHeaders()  ) {
      const result = await this.http.get('http://preprod.flai.com.do:8756/exo/loads')
      console.log(result.data)
      return result.data.filter(x => x.driver === 'Miguel Gonzalez')
    }
  }
}
  export default LoadsServices
  