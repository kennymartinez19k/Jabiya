// import axios from "axios";

class ManageOrders {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore
    }

    setURL(setting){
      this.settingsLocalStore = setting
    }

    async getOrders(){
        let body = {
            "method": "get",
            "uri": "trk/order?take=150",
            "data": {}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`,  body)
        return result.data

    }
    async orderNumIsDuplicated(val){
        let body = {
            "method": "get",
            "uri": `trk/order-num/${val}`,
            "data": {}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`,  body)
        return result.data

    }
    async getCustomers () {
        let body = {
            "method": "get",
            "uri": "trk/customer",
            "data": {}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`,  body)
        return result.data
    }
    
    async getServicesType(){
        let body = {
            "method": "get",
            "uri": "trk/serviceType",
            "data": {}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`,  body)
        return result.data.Result

    }

    async getWarehouse(){
        let body = {
            "method": "get",
            "uri": "trk/warehouse",
            "data": {}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`,  body)
        return result.data.Result

    }

    async getCity(){
        let body = {
            "method": "get",
            "uri": "trk/city",
            "data": {}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`,  body)
        return result.data.Result

    }
    
    async getSector(){
        let body = {
            "method": "get",
            "uri": "trk/sector",
            "data": {}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`,  body)
        return result.data.Result
    }

    async getProductForShipper(val){
        let body = {
            "method": "get",
            "uri": `trk/productForShipper?shipperId=${val}`,
            "data": {}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`,  body)
        return result.data.Result
    }

    async getClientName(val){
        let body = {
            "method": "get",
            "uri": `trk/clientList?client_name=${val}`,
            "data": {}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`,  body)
        return result?.data?.Result
    }

    
    
  
}
  export default ManageOrders
  