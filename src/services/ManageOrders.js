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
            "uri": "trk/order?take=70",
            "data": {}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`,  body)
        return result.data

    }
    async getOrdersFilter(expected_date, orderNum, client_name, status,  shipper, loadNumber, driver_name, serviceType){
        let body = {
            "method": "get",
            "uri": `trk/order?take=70&query={
                "expectedDateTxt":${JSON.stringify(expected_date)},
                "order_num":${JSON.stringify(orderNum) }, 
                "status": ${JSON.stringify(status)}, 
                "client_name": ${JSON.stringify(client_name)},
                "customer.name": ${JSON.stringify(shipper)}, 
                "loadDetails.loadNumber": ${JSON.stringify(loadNumber)}, 
                "serviceType": ${JSON.stringify(serviceType)}, 
                "loadDetails.driverName": ${JSON.stringify(driver_name)}
            }`,
            "data": {}
        }
        let result
        try{
            result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`,  body)
        }catch(error){
            console.log(error)
        }
        console.log(result)
        return result?.data

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
        console.log(result.data.Result)
        return result?.data?.Result
    }

    async createOrder(order){
        const OrderPost = {
            "order_num": order?.generalData?.orderNum,
            "expected_date": order?.generalData?.expectedDate,
            "expected_time": "...........",
            "warehouse": order?.generalData?.warehouse,
            "isReturn": order?.generalData?.isReturn,
            "hasAssociatedOrder": order?.generalData?.hasAssociatedOrder,
            "serviceType": order.generalData.servicesType,
            "client_id": order.client.id,
            "client_name": order.client.name,
            "email": order.client.email,
            "countryCode": order.client.phoneCountryCode,
            "phone": order.client.phoneNo,
            "customer": order.client.customer,
            "zone": '',
            "address": order.client.address,
            "sector": order.client.sector,
            "city": order.client.city,
            "province": order.client.province,
            "zipCode": order.client.codeZip,
            "latitude": order.client.latitudeClient,
            "longitude": order.client.longitudeClient,
            "status": 'Created',
            "products": order.products,
            "volume": 0,
            "no_of_boxes": 0,
            "weight": 0,
            "comment_by": `${order.client.email}`,
            "created_by": `${order.client.email}`,
            "created_group": 'EXO',
            "createdAt": new Date(),
            "oldFilesFromOrder": order.files
        }
        let cookie = localStorage.getItem('auth')

        const OrderEXO = JSON.stringify(OrderPost)
        const formData = new FormData()
        formData.append('uploadFile', OrderEXO)

        let body = {
            "method": "post",
            "uri": "trk/order",
            "data":{}
        }

        let headers ={
          'Content-Type': 'multipart/form-data',
          auth: cookie,
        }

        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`, body, formData, headers)
        return result

    }

    async deleteOrder(id){
        let body = {
            "method": "delete",
            "uri": `trk/order/${id}`,
            "data":{}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`, body)
        console.log(result)
        return result
    }

    
    
  
}
  export default ManageOrders
  