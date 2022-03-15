<template>
  <div class="uk-card uk-card-body uk-text-left">
      <form action="">
          <h6 class="uk-width-1-1">Datos Generales:</h6>
          <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Numero de Orden: *</label>
            <div class="uk-form-controls">
                <input :class="{isDuplicated: orderIsDuplicated}" v-model="generalData.orderNum" autocomplete="off" class="uk-input" id="form-stacked-text" type="text">
                <p v-if="orderIsDuplicated" style="font-size: 10px; color: rgb(255, 38, 38);">Numero de Orden Duplicado, Porfavor Introduzca Otro</p>
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Fecha Esperada: *</label>
            <div class="uk-form-controls">
                <input v-model="generalData.expectedDate" class="uk-input" id="form-stacked-text" type="date">
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Almacen: *</label>
            <div class="uk-form-controls">
                 <select v-model="generalData.warehouse" class="uk-select" name="" id="">
                    <option v-for="currentWarehouse in listWarehouse" :key="currentWarehouse">{{currentWarehouse.name}}</option>               
                </select>
            </div>
         </div>

         <div class="item ">
            <label class="uk-form-label text-small" for="form-stacked-text">Tipo de Servicio: *</label>
            <div class="uk-form-controls">
                 <select v-model="generalData.servicesType" class="uk-select" name="" id="">
                    <option value="" v-for="currentServices in listservicesType" :key="currentServices">{{currentServices}}</option>
                  
                </select>
            </div>
         </div>

         <div class="item ">
            <label class="uk-form-label text-small" for="form-stacked-text">Es Retorno? *</label>
            <div class="uk-form-controls">
                 <select v-model="generalData.isReturn" class="uk-select" name="" id="">
                    <option :value="false">No</option>
                    <option :value="true">Si</option>
                </select>
            </div>
         </div>

         <div class="item ">
            <label class="uk-form-label text-small" for="form-stacked-text">Tiene Orden Asociada?</label>
            <div class="uk-form-controls">
                <select v-model="generalData.hasAssociatedOrder" class="uk-select" name="" id="">
                    <option :value="false">No</option>
                    <option :value="true">Si</option>
                </select>
            </div>
         </div>

         <div class="item ">
            <label class="uk-form-label text-small" for="form-stacked-text">Estado: *</label>
            <p>Creada</p>
         </div>

         <div class="item ">
            <label class="uk-form-label text-small" for="form-stacked-text">Circulo de Entrega:</label>
            <div class="uk-form-controls">
                <input v-model="generalData.deliverCycle" class="uk-input" id="form-stacked-text" type="text">
            </div>
         </div>

         <div class="item ">
            <label class="uk-form-label text-small" for="form-stacked-text">Sequencia de Orden:</label>
            <div class="uk-form-controls">
                <input v-model="generalData.orderSequence" class="uk-input" id="form-stacked-text" type="number">
            </div>
         </div>

          <h6 class="uk-width-1-1">Cliente:</h6>

          <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Shipper: *</label>
            <div class="uk-form-controls">
                <select v-model="client.customer" @change="changeShipper()" class="uk-select" name="" id="">
                    <option v-for="currentCustomer in listCustomers" :key="currentCustomer" :value="currentCustomer">{{currentCustomer.name}}</option>
                </select>
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Nombre del Cliente: *</label>
            <div class="uk-form-controls" style="position: relative">
                <input v-model="client.name" @input="onChange" autocomplete="off" class="uk-input" id="form-stacked-text" type="text">
                <ul v-show="isOpen" class="autocomplete-results">
                    <li
                        v-for="(result, i) in results"
                        :key="i"
                        class="autocomplete-result"
                        @click="autoComplete(result)"
                    >
                    {{ result.client_name }}
                    </li>
                </ul>
            </div>
         </div>


         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Id Oficial:</label>
            <div class="uk-form-controls">
                <input v-model="client.id" class="uk-input" id="form-stacked-text" type="text">
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Dirección: *</label>
            <div class="uk-form-controls">
                <input v-model="client.address" class="uk-input" id="form-stacked-text" type="text">
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Provincia: *</label>
            <div class="uk-form-controls">
                <select v-model="client.province" class="uk-select" name="" id="">
                    <option v-for="currentProvince in listProvinces" :key="currentProvince">{{currentProvince}}</option>
                </select>
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Ciudad: *</label>
            <div class="uk-form-controls">
               <select v-model="client.city" class="uk-select" name="" id="">
                    <option v-for="currentCity in listCities" :key="currentCity">{{currentCity.name}}</option>
                </select>
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Sector: *</label>
            <div class="uk-form-controls">
               <select v-model="client.sector" class="uk-select" name="" id="">
                    <option v-for="currentSector in listSectors" :key="currentSector">{{currentSector.sector}}</option>
                </select>
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Codigo Zip:</label>
            <div class="uk-form-controls">
                <input v-model="client.codeZip" class="uk-input" id="form-stacked-text" type="text">
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Latitud y Longitud del Sector:</label>
            <div class="uk-form-controls">
                <input v-model="client.lat_Long_Sector" class="uk-input" id="form-stacked-text" type="text">
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Email: *</label>
            <div class="uk-form-controls">
                <input v-model="client.email" class="uk-input" id="form-stacked-text" type="text">
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Prefijo Telefonico: *</label>
            <div class="uk-form-controls">
                <input v-model="client.phoneCountryCode" class="uk-input" id="form-stacked-text" type="text">
            </div>
         </div>

         <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Telefono: *</label>
            <div class="uk-form-controls">
                <input v-model="client.phoneNo" class="uk-input" id="form-stacked-text" type="text">
            </div>
         </div>

          <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Latitud del Cliente:</label>
            <div class="uk-form-controls">
                <input v-model="client.latitudeClient" class="uk-input" id="form-stacked-text" type="number">
            </div>
         </div>

          <div class="item">
            <label class="uk-form-label text-small" for="form-stacked-text">Longitud del Cliente:</label>
            <div class="uk-form-controls">
                <input v-model="client.longitudeClient" class="uk-input" id="form-stacked-text" type="number">
            </div>
         </div>


        <h6 class="uk-width-1-1">Productos:</h6>
        <div style="width: 100%" v-for="(product, i) in productsCreated" :key="product">
            <div class="uk-card product-item">
                <span class="uk-badge">{{i + 1}}</span>
                <div class="uk-flex uk-flex-wrap">
                    <p><strong>ID del Producto:</strong> {{product?.productId}}</p>
                    <p class="uk-width-1-2"><strong>QrCode:</strong> {{product?.qrCode}}</p>
                    <p><strong>Descripción:</strong> {{product?.productId}}</p>
                    <p><strong>Cantidad:</strong> {{product?.quantity}}</p>
                </div>
                <div class="icon">
                    <font-awesome-icon @click="editProduct(i)" icon="pen" class="icon-action"/>
                    <font-awesome-icon @click="deleteProduct(i)" icon="trash-alt" class="icon-action"/>
                </div>
            </div>
        </div>

        <div v-if="addProduct" class="uk-flex uk-flex-between uk-flex-wrap">
            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">ID del Producto:</label>
                <div class="uk-form-controls">
                    <select v-model="product.productId" @change="changeProduct(product)" class="uk-select" name="" id="">
                        <option v-for="prod in products" :key="prod" >{{prod.productId}}</option>
                    </select>
                </div>
            </div>
            
            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Escanear 1 por 1: *</label>
                <div class="uk-form-controls">
                  <select v-model="product.scan1by1" class="uk-select" name="" id="">
                    <option :value="false">No</option>
                    <option :value="true">Si</option>
                  </select>
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">QrCode por Defecto:</label>
                <div class="uk-form-controls">
                    <input v-model="product.qrCode_Default" class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">QrCode para usar en Orden:</label>
                <div class="uk-form-controls">
                    <input v-model="product.qrCode" class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Descripcion: *</label>
                <div class="uk-form-controls">
                    <input v-model="product.description" class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Cantidad: *</label>
                <div class="uk-form-controls">
                    <input v-model="product.quantity" class="uk-input" id="form-stacked-text" type="number">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Volumen (m<sup>3</sup>):</label>
                <div class="uk-form-controls">
                    <input v-model="product.volume" class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Peso (Kg):</label>
                <div class="uk-form-controls">
                    <input v-model="product.weight" class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Manejo especial y tipo de facturación:</label>
                <div class="uk-form-controls">
                    <input v-model="product.typeInvoices" class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div v-if="addProduct" class="uk-flex uk-flex-column uk-flex-right item">
                <button type="button" @click="saveProduct()" class="uk-button-blue uk-button">Guardar Producto</button>
            </div>
        </div>
        <div v-if="!addProduct" @click="addProduct = true">
            <p>Agregar Producto &nbsp;<font-awesome-icon icon="plus" class="plus"/></p>
        </div>

      </form>
      <h6 class="uk-width-1-1">Agregar Información Adicional:</h6>
      <div class="files-container">
          <div class="add-file">
             <font-awesome-icon icon="plus" class="plus"/>

          </div>
      </div>
      <h6 class="uk-width-1-1">Comentario:</h6>
      <div class="uk-form-controls">
        <input v-model="comment" class="uk-input" id="form-stacked-text" type="text">
      </div>

      <div class="uk-margin uk-flex uk-flex-right">
          <button @click="cancel()" class="uk-button-red uk-button">Cancelar</button>
          <button @click="sendInfo()" class="uk-button-blue uk-button">Guardar</button>
      </div>
  </div>
</template>

<script>
export default {
    alias: 'Crear Orden',
    data(){
        return{
            listWarehouse: [],
            listservicesType: [],
            listCustomers: [],
            listProvinces: [],
            listCities: [],
            listSectors: [],
            listOrders: [],

            generalData:{
                orderNum: null,
                expectedDate: null,
                warehouse: null,
                listWarehouse: [],
                isReturn: null,
                hasAssociatedOrder: null,
                deliverCycle: null,
                orderSequence: null
            },
            client:{
                customer: null,
                name: null,
                id: null,
                address: null,
                province: null,
                city: null,
                sector: null,
                codeZip: null,
                lat_Long_Sector: null,
                email: null,
                phoneCountryCode: null,
                phoneNo: null,
                latitudeClient: null,
                longitudeClient: null
            },
            product:{
                productId: null,
                scan1by1: false,
                qrCode_Default: null,
                qrCode: null,
                description: null,
                quantity: null,
                volume: null,
                weight: null,
                typeInvoices: null
            },

            addProduct: false,
            comment: null,
            cities: [],
            sectors: [],
            products: [],


            results: [],
            isOpen: false,
            orderIsDuplicated: false,
            productsCreated: [],
        }
    },
    async mounted(){
        
        this.productForReset = {...this.product}


        this.listCustomers = await this.$services.manageOrders.getCustomers()
        this.listservicesType = await this.$services.manageOrders.getServicesType()
        this.listWarehouse = await this.$services.manageOrders.getWarehouse()
        this.cities = await this.$services.manageOrders.getCity()
        let provinces = []
        this.cities.forEach(city => {
            provinces.push(city.province)
        })
        provinces = new Set(provinces)
        this.listProvinces = [...provinces]
        this.sectors = await this.$services.manageOrders.getSector()
    },
    watch:{
        generalData:{
            handler: async function(newVal){
                if(newVal){
                    console.log(newVal?.orderNum)
                    
                    if(newVal?.orderNum > 0 && newVal.orderNum){
                        let delay = ms => new Promise(res => setTimeout(res, ms));
                        await delay(2000);
                       
                        if(newVal.orderNum){
                            let result = await this.$services.manageOrders.orderNumIsDuplicated(newVal.orderNum)
                            this.orderIsDuplicated = result.isDuplicate
                        }
                    }

                }
            }, deep: true
        },
        client: {
            handler: function ( newVal) {
              
              let cities = this.cities.filter(city => city.province == newVal.province)
              if(cities){
                this.listCities = [...cities]
              }
              let sectors = this.sectors.filter(sector => sector.province == newVal.province)
              if(sectors){

              this.listSectors = [...sectors]
              }
            },
      deep: true
    },
    },
    methods:{
    
    cancel(){
        this.$router.push({name: 'manage-orders'})
    },

    async filterResults() {
        if(this.client.name.length > 2){
            this.results = await this.$services.manageOrders.getClientName(this.client.name)
        }
    },
    onChange() {
      this.filterResults();
      this.isOpen = true;
    },
    autoComplete(newVal){
        this.isOpen = false
        if(newVal)
          this.client.name = newVal.client_name
          this.client.id = newVal.Official_ID
          this.client.address = newVal.address
          this.client.province = newVal.province
          this.client.city = newVal.city
          this.client.sector = newVal.sector
          this.client.codeZip = newVal.zipCode
          this.client.lat_Long_Sector = `${newVal.latitude} ${newVal.longitude}`
          this.client.email = newVal.email
          this.client.phoneCountryCode = newVal.countryCode
          this.client.phoneNo = newVal.phone
          this.client.latitudeClient = newVal.latitude
          this.client.longitudeClient = newVal.longitude

          console.log(this.client)
    },
    async changeShipper(){
        console.log(this.client.customer)
        try{
            let result = await this.$services.manageOrders.getProductForShipper(this.client.customer._id)

            if(result){
                console.log(result)
                this.products = result
            }
        }catch(error){
            console.log(error)
        }

        

    },
    async changeProduct(val){
        let product = this.products.find(prod => prod.productId == val.productId)
        console.log( product)
        if(product){
            this.product.qrCode_Default = product.qrCode
            this.product.qrCode = product.qrCode
            this.product.description = product.description
            this.product.volume = product.volume
            this.product.weight = product.weight
            this.product.quantity = product.unitDetails.defaultNumberOfUnit
        }
        console.log(this.product)
        console.log(product)
        

    },
    sendInfo(){
        console.log(this.client, this.product, this.generalData)

    },
    saveProduct(){
        this.productsCreated.push(this.product)
        
        this.product = {...this.productForReset}
    },
    deleteProduct(i){
        this.productsCreated.splice(i, 1)
    },
    editProduct(i){
        this.product = {...this.productsCreated[i]}
        this.deleteProduct(i)
    }
    }

}
</script>

<style scoped>


.uk-card-body{
    padding: 15px !important;
}
form{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
}
.text-small{
    font-size: 12px;
}
.item{
    margin: 10px 0px;
    width: 45%
}
.files-container{
    width: 100%;
    min-height: 40px;
    border: 1px solid rgb(133, 133, 133);
    border-radius: 5px;
    padding: 15px 10px;
}
.add-file{
    height: 40px;
    width: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 18px;
}
.plus{
    color: rgb(55, 55, 163);
}
input{
    border: 1px solid #ccc;
}
button{
    margin: 0px 5px;
}
.autocomplete-result{
    padding: 5px 0px;
}
.autocomplete-results{
    list-style: none;
    margin: 0px;
    padding: 5px;
    box-shadow: 0px 0px 1px #000;
    position: absolute;
    background: #fff;
    width: 100%;
}
.isDuplicated{
    border: 1px solid rgb(255, 38, 38);
}

.product-item{
    display: flex;
    padding: 20px 5px 5px;
    border: 1px solid #c5c5c5;
    border-radius: 5px;
    margin: 5px 0px;
    background: #e8f5ff;
}

.product-item p{
    font-size: 10px;
    margin-right: 10px;
}
.product-item strong{
    font-size: 10px !important;
}
.uk-badge{
    width: 14px;
    height: 17px;
    position: absolute;
    font-weight: 600;
    font-size: 10px;
    left: 2px;
    margin-right: 8px;
    top: 2px;

}
.icon-action{
    margin-left:  10px;
    font-size: 15px;
    font-size: 14px;
}
.icon{
    display: flex;
    width: 58px;
    position: absolute;
    right: -2px;
    top: 3px;
}
</style>