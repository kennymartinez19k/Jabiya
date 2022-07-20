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
        return result?.data?.Result
    }

    async createOrder(order){
        let productsForPost = []

        for (let i = 0; i < order.products.length; i++) {
            const product = order.products[i];
            let productPost = {
                "product.qrCode" : product.qrCode, 
                "product.scanOneByOne" : product.scanOneByOne,
                "product.quantity" : product.quantity,
                "product.unitVolume" : `${product.volume}`,
                "product.unitWeight" : product.weight,
                "product.volume" : `${product.volume}`,
                "product.weight" : product.weight,
            }

            productsForPost.push(productPost)
        }

        const OrderPost = {
            "order_num": order?.generalData?.order_num,
            "expected_date": order?.generalData?.expected_date,
            "expected_time": "17:07",
            "warehouse": order?.generalData?.warehouse,
            "isReturn": order?.generalData?.isReturn,
            "hasAssociatedOrder": order?.generalData?.hasAssociatedOrder,
            "serviceType": order.generalData.serviceType,
            "client_id": order.client.Official_ID,
            "client_name": order.client.client_name,
            "email": order.client.email,
            "countryCode": order.client.phoneCountryCode,
            "phone": order.client.phone,
            "customer": order.client.customer,
            "zone": '',
            "address": order.client.address,
            "sector": order.client.sector,
            "city": order.client.city,
            "province": order.client.province,
            "zipCode": order.client.zipCode,
            "latitude": order.client.latitude,
            "longitude": order.client.longitude,
            "status": 'Created',
            "products": productsForPost,
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
        formData.append('order', OrderEXO)

        let headers ={
          'Content-Type': 'multipart/form-data',
          auth: cookie,
        }

        const result = await this.http.post(`https://991d-179-52-157-140.ngrok.io/exo/ordersV2`, formData, headers )
        return result

    }

    async deleteOrder(id){
        let body = {
            "method": "delete",
            "uri": `trk/order/${id}`,
            "data":{}
        }
        const result = await this.http.post(`https://preprod.flai.com.do/orchestrator/exo/requests`, body)
        return result
    }

    
    
  
}
  export default ManageOrders
  