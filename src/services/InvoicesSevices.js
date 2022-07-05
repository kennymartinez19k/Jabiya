
class InvoicesSevices {
    constructor (http) {
      this.http = http
      this.settingsLocalStore
    }
    
    setURL(val){
      this.settingsLocalStore = val
    }
  
    async getLoginInvoices () {
        const signIn = {jsonrpc: "2.0", params: {login: "809123121",password:"admin"}}
      const result = await this.http.post(`${hostEnum.odoo}/api/auth/sign_in`, signIn, {withCredentials: true })
      return result.data.data
    }

    async getInvoices () {
        const result = await this.http.post(`${hostEnum.odoo}/api/order?from=Diciembre 11, 2020&to=Noviembre 11, 2022`,{withCredentials: true })
        return result.data.data
      }
  }
  export default InvoicesSevices
  