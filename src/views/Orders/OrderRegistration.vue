<template>

  <div class="uk-card uk-card-body uk-text-left">
       <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeout"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>


      <form action="">
          <h6 class="uk-width-1-1">Datos Generales:</h6>
          <div class="section-data">
            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Numero de Orden: *</label>
                <div class="uk-form-controls">
                    <input  :class="{isDuplicated: orderIsDuplicated, isEmpty: !generalData?.order_num && isValidate, 'disabled-item': isOrderEdit || isNotModificate}" v-model="generalData.order_num" autocomplete="off" class="uk-input" id="form-stacked-text" type="text">
                    <p v-if="orderIsDuplicated" style="font-size: 10px; color: rgb(255, 38, 38);">Numero de Orden Duplicado, Porfavor Introduzca Otro</p>
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Fecha de Entrega: *</label>
                <div class="uk-form-controls">
                    
                    <input :class="{isEmpty: !generalData?.expected_date && isValidate, 'disabled-item': isNotModificate}" v-model="generalData.expected_date" class="uk-input" style="padding: 0px 0px 0px 3px !important" id="form-stacked-text" type="datetime-local">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Almacen: *</label>
                <div class="uk-form-controls">
                    <select :class="{isEmpty: !generalData?.warehouse?.name && isValidate, 'disabled-item': isNotModificate}" v-model="generalData.warehouse.name"  class="uk-select">
                        <option v-for="currentWarehouse in listWarehouse" :key="currentWarehouse">{{currentWarehouse?.name}}</option>               
                    </select>
                </div>
            </div>

            <div class="item ">
                <label class="uk-form-label text-small" for="form-stacked-text">Tipo de Servicio: *</label>
                <div class="uk-form-controls">
                    <select :class="{isEmpty: !generalData.serviceType && isValidate, 'disabled-item': isNotModificate}"  v-model="generalData.serviceType" class="uk-select" name="" id="">
                        <option :value="currentServices" v-for="currentServices in listservicesType" :key="currentServices">{{currentServices}}</option>
                    </select>
                </div>
            </div>

            <div class="item ">
                <label class="uk-form-label text-small" for="form-stacked-text">Es Retorno? *</label>
                <div class="uk-form-controls">
                    <select :class="{isEmpty: !generalData.isReturn && isValidate, 'disabled-item': isNotModificate}" @change="orderIsReturn()" v-model="generalData.isReturn" class="uk-select" name="" id="">
                        <option :value="false">No</option>
                        <option :value="true">Si</option>
                    </select>
                </div>
            </div>

            <div class="item ">
                <label class="uk-form-label text-small" for="form-stacked-text">Tiene Orden Asociada?</label>
                <div class="uk-form-controls">
                    <select v-if="generalData.isReturn" :class="{'disabled-item': isNotModificate}" v-model="generalData.hasAssociatedOrder" class="uk-select" name="" id="">
                        <option :value="false">No</option>
                        <option :value="true">Si</option>
                    </select>
                    <p v-else>No</p>
                </div>
            </div>

            <div class="item ">
                <label class="uk-form-label text-small" for="form-stacked-text">Estado: *</label>
                <p>{{ translateOrderStatus(generalData.status)}}</p>
            </div>

            <div class="item ">
                <label class="uk-form-label text-small" for="form-stacked-text">Ciclo de Entrega:</label>
                <div class="uk-form-controls">
                    <input v-model="generalData.deliverCycle" :class="{'disabled-item': isNotModificate}" class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item ">
                <label class="uk-form-label text-small" for="form-stacked-text">Numero de Secuencia:</label>
                <div class="uk-form-controls">
                    <input v-model="generalData.orderSequence" :class="{'disabled-item': isNotModificate}" class="uk-input" id="form-stacked-text" type="number">
                </div>
            </div>
          </div>

          <h6 class="uk-width-1-1">Cliente:</h6>
          <div class="section-data">

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Shipper: *</label>
                <div class="uk-form-controls">
                    <select v-model="client.customer.name" @change="changeShipper()" :class="{isEmpty: !client.customer && isValidate, 'disabled-item': isNotModificate}" class="uk-select" name="" id="">
                        <option v-for="currentCustomer in listCustomers" :key="currentCustomer" :value="currentCustomer.name">{{currentCustomer.name}}</option>
                    </select>
                </div>
            </div>
            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Nombre del Cliente: *</label>
                <div class="uk-form-controls" style="position: relative">
                    <input :class="{isEmpty: !client.client_name && isValidate, 'disabled-item': !client?.customer?.name || isNotModificate}" v-model="client.client_name" @keyup="onChange()" autocomplete="off" class="uk-input" id="form-stacked-text" type="text">
                    <ul v-show="isOpen && results?.length > 0" class="autocomplete-results">
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
                    <input v-model="client.Official_ID" :class="{'disabled-item': !client?.customer?.name || isNotModificate}"  class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Dirección: *</label>
                <div class="uk-form-controls">
                    <input :class="{isEmpty: !client.address && isValidate, 'disabled-item': !client?.customer?.name || isNotModificate}" v-model="client.address" class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Provincia: *</label>
                <div class="uk-form-controls">
                    
                    <select v-model="client.province" :class="{isEmpty: !client.province && isValidate, 'disabled-item': !client?.customer?.name || isNotModificate}"  class="uk-select" name="" id="">
                        <option v-for="currentProvince in listProvinces" :key="currentProvince" :value="currentProvince">{{currentProvince}}</option>
                    </select>
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Ciudad: *</label>
                <div class="uk-form-controls">
                <select :class="{isEmpty: !client.city && isValidate, 'disabled-item': !client?.customer?.name || isNotModificate}" v-model="client.city" class="uk-select" name="" id="">
                        <option v-for="currentCity in listCities" :key="currentCity" >{{currentCity?.name}}</option>
                    </select>
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Sector: *</label>
                <div class="uk-form-controls">
                <select :class="{isEmpty: !client.sector && isValidate, 'disabled-item': !client?.customer?.name || isNotModificate}" v-model="client.sector" class="uk-select" name="" id="">
                        <option v-for="currentSector in listSectors" :key="currentSector">{{currentSector.sector}}</option>
                    </select>
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Codigo Zip:</label>
                <div class="uk-form-controls">
                    <input v-model="client.zipCode" :class="{ 'disabled-item': !client?.customer?.name || isNotModificate}"  class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Latitud y Longitud del Sector:</label>
                <div class="uk-form-controls">
                    <input v-model="client.lat_Long_Sector"  :class="{ 'disabled-item': !client?.customer?.name || isNotModificate}"  class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Email: *</label>
                <div class="uk-form-controls">
                    <input :class="{isEmpty: !client.email && isValidate, 'disabled-item': !client?.customer?.name || isNotModificate}" v-model="client.email" class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Prefijo Telefonico: *</label>
                <div class="uk-form-controls">
                    <input :class="{isEmpty: !client.phoneCountryCode && isValidate, 'disabled-item': !client?.customer?.name || isNotModificate}" v-model="client.phoneCountryCode" class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Telefono: *</label>
                <div class="uk-form-controls">
                    <input :class="{isEmpty: !client.phone && isValidate, 'disabled-item': !client?.customer?.name || isNotModificate}" v-model="client.phone" class="uk-input" id="form-stacked-text" type="text">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Latitud del Cliente:</label>
                <div class="uk-form-controls">
                    <input v-model="client.latitudeClient" :class="{'disabled-item': !client?.customer?.name || isNotModificate}"  class="uk-input" id="form-stacked-text" type="number">
                </div>
            </div>

            <div class="item">
                <label class="uk-form-label text-small" for="form-stacked-text">Longitud del Cliente:</label>
                <div class="uk-form-controls">
                    <input v-model="client.longitudeClient" :class="{'disabled-item':!client?.customer?.name || isNotModificate}" class="uk-input" id="form-stacked-text" type="number">
                </div>
            </div>
          </div>

          <h6 class="uk-width-1-1">Agregar Nuevo Producto:</h6>
          <div class="section-data" :class="{isEmpty: productsCreated.length == 0 && isValidate}">
            <div style="width: 100%" v-for="(product, i) in productsCreated" :key="product">
                <div class="uk-card product-item">
                    <span class="uk-badge">{{i + 1}}</span>
                    <div class="uk-flex uk-flex-wrap">
                        <p><strong>ID del Producto:</strong> {{product?.productId}}</p>
                        <p class="uk-width-1-2"><strong>QrCode:</strong> {{product?.qrCode}}</p>
                        <p><strong>Descripción:</strong> {{product?.description}}</p>
                        <p><strong>Cantidad:</strong> {{product?.quantity}}</p>
                    </div>
                    <div class="icon">
                        <font-awesome-icon  @click="editProduct(i)" icon="pen" class="icon-action"/>
                        <font-awesome-icon :class="{'icon-disabled': isNotModificate}" @click="deleteProduct(i)" icon="trash-alt" class="icon-action"/>
                    </div>
                </div>
            </div>

            <div v-if="!addProduct"  @click="isOpenModal = true" class="uk-flex uk-flex-middle">
                <p style="margin: 10px 0px"> &nbsp;<font-awesome-icon :class="{'icon-disabled': isNotModificate}" icon="plus" class="plus"/></p>
            <p v-if="!client.customer?.name" style="margin: 0px 10px"> Por favor, Elija un Shipper</p>

            </div>

          </div>

      </form>
      <h6 class="uk-width-1-1">Agregar Información Adicional:</h6>
      <div class="files-container">
          <div class="add-file">
              <label for="file" :class="{'icon-disabled': isNotModificate}">
                  <span>
                    <font-awesome-icon :class="{'icon-disabled': isNotModificate}"  icon="plus" class="plus"/>
                  </span>
                <input type="file" id="file" ref="File" @change="pickFile($event)">
              </label>

          </div>
          <div class="product-file" v-for="(file, i) in files" :key="file">
              <p>{{file?.name}}</p>
              <font-awesome-icon icon="trash-alt" @click="deleteFile(i)" class="icon-file"/>
          </div>
      </div>
      <h6 class="uk-width-1-1">Comentario:</h6>
      <div class="uk-form-controls">
        <input v-model="comment" class="uk-input" id="form-stacked-text" type="text">
      </div>

      <div class="uk-margin uk-flex uk-flex-right">
          <button @click="cancel()" class="uk-button-red uk-button">Cancelar</button>
          <button @click="sendInfo()" :disabled="isEmptyFields || isNotModificate"  class="uk-button-primary uk-button">Guardar</button>
      </div>

      <transition name="modal">
      <div v-if="isOpenModal">
        <div class="overlay" @click.self="closeModal()">
          <div class="modal">
            <div class="">
            <p class="uk-text-center" style="margin: 0px 0px 10px"><strong>Añadir Producto</strong></p>
            <div class="uk-flex uk-flex-between uk-flex-wrap">
                <div class="item">
                    
                    <label class="uk-form-label text-small" for="form-stacked-text">ID del Producto:</label>
                    <div class="uk-form-controls">
                        <select  :class="{'disabled-item': !client?.customer?.name || isNotModificate}" v-model="product.productId" @change="changeProduct(product)" class="uk-select" name="" id="">
                            <option v-for="prod in products" :key="prod" >{{prod.productId}}</option>
                        </select>
                    </div>
                </div>
                
                <div class="item">
                    
                    <label class="uk-form-label text-small" for="form-stacked-text">Escanear 1 por 1: *</label>
                    <div class="uk-form-controls">
                    <select :class="{'disabled-item': !client?.customer?.name || isNotModificate}" v-model="product.scanOneByOne" class="uk-select" name="" id="">
                        <option value="no">No</option>
                        <option value="yes">Si</option>
                    </select>
                    </div>
                </div>

                <div class="item">
                    <label class="uk-form-label text-small" for="form-stacked-text">QrCode por Defecto:</label>
                    <div class="uk-form-controls">
                        <input :class="{'disabled-item': !client?.customer?.name || isNotModificate}" v-model="product.qrCode_Default" class="uk-input" id="form-stacked-text" type="text">
                    </div>
                </div>

                <div class="item">
                    <label class="uk-form-label text-small" for="form-stacked-text">QrCode para usar en Orden:</label>
                    <div class="uk-form-controls">
                        <input :class="{'disabled-item': !client?.customer?.name || isNotModificate}" v-model="product.qrCode" class="uk-input" id="form-stacked-text" type="text">
                    </div>
                </div>

                <div class="item">
                    <label class="uk-form-label text-small" for="form-stacked-text">Descripcion: *</label>
                    <div class="uk-form-controls">
                        <input :class="{'disabled-item': !client?.customer?.name || isNotModificate}" v-model="product.description" class="uk-input" id="form-stacked-text" type="text">
                    </div>
                </div>

                <div class="item">
                    <label class="uk-form-label text-small" for="form-stacked-text">Cantidad: *</label>
                    <div class="uk-form-controls">
                        <input :class="{'disabled-item': !client?.customer?.name || isNotModificate}" v-model="product.quantity" class="uk-input" id="form-stacked-text" type="number">
                    </div>
                </div>

                <div class="item">
                    <label class="uk-form-label text-small" for="form-stacked-text">Volumen (m<sup>3</sup>):</label>
                    <div class="uk-form-controls">
                        <input :class="{'disabled-item': !client?.customer?.name || isNotModificate}" v-model="product.volume" class="uk-input" id="form-stacked-text" type="text">
                    </div>
                </div>

                <div class="item">
                    <label class="uk-form-label text-small" for="form-stacked-text">Peso (Kg):</label>
                    <div class="uk-form-controls">
                        <input :class="{'disabled-item': !client?.customer?.name || isNotModificate}" v-model="product.weight" class="uk-input" id="form-stacked-text" type="text">
                    </div>
                </div>

                <div class="item">
                    <label class="uk-form-label text-small" for="form-stacked-text">Manejo especial y tipo de facturación:</label>
                    <div class="uk-form-controls">
                        <input :class="{'disabled-item': !client?.customer?.name || isNotModificate}" v-model="product.typeInvoices" class="uk-input" id="form-stacked-text" type="text">
                    </div>
                </div>

                
            </div>
            <p class="uk-text-right uk-flex uk-flex-right" style="margin-top: 20px !important;">
                <button class="uk-button uk-button-red uk-modal-close" style="margin: 0px 10px" @click="closeModal()" type="button">Cancelar</button>
                <button class="uk-button uk-button-primary uk-modal-close" :disabled="productEmptyFields || isNotModificate" @click="saveProduct()" type="button">Guardar</button>
            </p>
        </div>
        
          </div>
        </div>
      </div>
    </transition>
      
  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";
import { Mixins } from '../../mixins/mixins'

export default {
    alias: 'Crear Orden',
    components: {
      IonLoading,
    },
    mixins: [Mixins],

    data(){
        return{
            isFalse: false,
            listWarehouse: [],
            listservicesType: [],
            listCustomers: [],
            listProvinces: [],
            listCities: [],
            listSectors: [],
            listOrders: [],
            typeScan: [{yes: 'si', no: 'no'}],

            generalData:{
                order_num: null,
                expected_date: null,
                warehouse: {
                    name: null,
                    id: null
                },
                isReturn: false,
                status: 'Created',
                hasAssociatedOrder: false,
                deliverCycle: null,
                orderSequence: null,
                serviceType: null
            },
            client:{
                Official_ID: null,
                customer: {
                    name: null,
                    _id: null
                },
                client_name: null,
                address: null,
                province: '',
                city: null,
                sector: null,
                zipCode: null,
                lat_Long_Sector: null,
                email: null,
                phoneCountryCode: null,
                phone: null,
                latitude: null,
                longitude: null
            },
            product:{
                productId: null,
                scanOneByOne: 'no',
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
            files: [],
            isOpenModal: false,
            isValidate: false,
            productForReset: {},
            clientForReset: {},
            isOrderEdit: false,
            isNotModificate:false,
            timeout: 20000,
            selectedItem: 2
        }
    },
    setup() {
        const isOpenRef = ref(false);
        const setOpen = (state) => (isOpenRef.value = state);

        return { isOpenRef, setOpen };
    },
    computed:{
        ...mapGetters(['orderManageStore']),

        isEmptyFields(){
            let requireFields = []
            let {order_num, expected_date, warehouse, isReturn} = this.generalData
            let { customer, client_name, address, province, city, sector, email, phoneCountryCode, phone } = this.client

            requireFields.push(
                order_num, expected_date,  warehouse, isReturn, customer, client_name, address, province, city, sector,
                customer, address, province, city, sector, email, phoneCountryCode, phone,
                this.productsCreated
            )

            return requireFields?.some(field => field === null || field === '' || field?.length ==  0)
        },
        productEmptyFields(){
           let { productId, scanOneByOne, qrCode_Default, qrCode, description, quantity, volume, weight} = this.product
           let emptyFields = [productId, scanOneByOne, qrCode_Default, qrCode, description, quantity, volume, weight]
           return emptyFields.some(field => field === null || field === '' || field?.length ==  0)
        }
    },
    async mounted(){
        this.setOpen(true)
        try{
            this.listCustomers = await this.$services.manageOrders.getCustomers()
            this.listservicesType = await this.$services.manageOrders.getServicesType()
            this.listWarehouse = await this.$services.manageOrders.getWarehouse()
            console.log(this.listWarehouse)
            this.cities = await this.$services.manageOrders.getCity()
        }catch(error){
            alert(error)
        }
        let provinces = []
        this.cities.forEach(city => {
            provinces.push(city?.province)
        })

        provinces = new Set(provinces)
        this.listProvinces = [...provinces]

        this.productForReset = {...this.product}
        this.clientForReset = {...this.client}

        this.sectors = await this.$services.manageOrders.getSector()

        if(this.orderManageStore){
           this.editManageOrder()
        }
        this.setOpen(false)
    },
    watch:{
        generalData:{
            handler: async function(newVal){
                if(newVal){
                    
                    if(newVal?.order_num > 0 && newVal.order_num && !this.isOrderEdit){
                        let delay = ms => new Promise(res => setTimeout(res, ms));
                        await delay(2000);
                       
                        if(newVal.order_num){
                            let result = await this.$services.manageOrders.orderNumIsDuplicated(newVal.order_num)
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
        'generalData.warehouse.name': {
            handler: function(newVal){
                if(newVal){
                   let warehouse = this.listWarehouse.find(x => x.name == newVal)
                   if(warehouse){
                       this.generalData.warehouse = {...warehouse}
                   }
                }
            }, deep: true
        }, 
        // 'client.client_name': {
        //     handler: function(){
        //         this.onChange()
        //     }
        // }
        
    },
    methods:{
    
    cancel(){
        this.$router.push({name: 'manage-orders'})
    },

    async filterResults() {
        if(this.client.client_name?.length > 2){
            this.results = await this.$services.manageOrders.getClientName(this.client.client_name)
        }
    },
    onChange() {
      this.filterResults();
      this.isOpen = true;
    },
    autoComplete(newVal){
        this.isOpen = false
        if(newVal){
            this.client.client_name = newVal.client_name
            this.client.Official_ID = newVal.Official_ID
            this.client.address = newVal.address
            this.client.province = newVal.province
            this.client.city = newVal.city
            this.client.sector = newVal.sector
            this.client.zipCode = newVal.zipCode
            this.client.lat_Long_Sector = `${newVal.latitude} ${newVal.longitude}`
            this.client.email = newVal.email
            this.client.phoneCountryCode = newVal.countryCode
            this.client.phone = newVal.phone
            this.client.latitude = newVal.latitude
            this.client.longitude = newVal.longitude
        }
        this.results = []


    },
    async changeShipper(){
        let customer = this.client.customer
        this.client = {...this.clientForReset}
        this.productsCreated = []
        customer =  this.listCustomers.find(cust => cust.name == customer.name)
        if(customer){
            this.client.customer._id = customer?._id
            this.client.customer.name = customer?.name
        }
        try{
            let result = await this.$services.manageOrders.getProductForShipper(this.client?.customer?._id)
            if(result){
                this.products = result
            }
        }catch(error){
            console.log(error)
        }
    },
    async editManageOrder(){
        console.log(this.orderManageStore)
         if(this.orderManageStore.status != 'Created') this.isNotModificate = true
            this.isOrderEdit = true
            let {
                order_num, expected_date, warehouse, isReturn, hasAssociatedOrder, serviceType, status, deliverCycle,
                customer, client_name, Official_ID, address, province, city, sector, zipCode, latitude, longitude,
                email, phone, products
            } = this.orderManageStore

            expected_date = expected_date.split('.')

            this.generalData = {order_num, expected_date: expected_date[0], warehouse, isReturn, hasAssociatedOrder, status, serviceType, deliverCycle, 'orderSequence': null}
            
            province = province.toLowerCase()
            city = city.toLowerCase()
            sector = sector.toLowerCase()
            this.client = {customer, client_name, Official_ID, address, province, city, sector, zipCode, 'lat_Long_Sector': `${latitude} ${longitude}`, latitude, longitude, email, phone}

            this.productsCreated = [...products]
            this.productsCreated.map(x => x.productId = x.name)
            this.$store.commit('editOrder', null)

            this.cities.forEach(city => city.province = city?.province?.toLowerCase())

            let cities = this.cities.filter(city => city?.province == this.client?.province)
              if(cities){
                this.listCities = [...cities]
              }
              let sectors = this.sectors.filter(sector => sector?.province == this.client?.province)
              if(sectors){
                this.listSectors = [...sectors]
              }
            let result = await this.$services.manageOrders.getProductForShipper(this.client?.customer?._id)
            if(result){
                this.products = result
            }
            
    },
    async changeProduct(val){
        let product = this.products.find(prod => prod.productId == val.productId)
        if(product){
            this.product.qrCode_Default = product.qrCode
            this.product.qrCode = product.qrCode
            this.product.description = product.description
            this.product.volume = product.volume
            this.product.weight = product.weight
            this.product.quantity = product.unitDetails.defaultNumberOfUnit
        }
    },
    async sendInfo(){

        let data = {
            client: this.client,
            generalData: this.generalData,
            products: this.productsCreated,
            files: this.files
        }
        console.log(this.generalData, this.client, this.productsCreated)
         await this.$services.manageOrders.createOrder(data)
        
        

    },
    saveProduct(){
        let index = this.productsCreated.findIndex(prod => prod.productId == this.product.productId)
        if(index >= 0){
            this.productsCreated.splice(index, 1)
        }
        this.productsCreated.push(this.product)
        this.isOpenModal = false
        this.product = {...this.productForReset}
    },
    deleteProduct(i){
        this.productsCreated.splice(i, 1)
    },
    editProduct(i){
        this.isOpenModal = true

        this.product = {...this.productsCreated[i]}
        // this.deleteProduct(i)
    },
    pickFile(event){
        let file = event.target.files[0]
        this.files.push(file)
    },
    deleteFile(i){
        this.files.splice(i, 1)
    },
    closeModal(){
        this.isOpenModal = false
        this.product = {...this.productForReset}
    },
    orderIsReturn(){
       this.generalData.hasAssociatedOrder = this.generalData.isReturn == false
    }
    }

}
</script>

<style scoped>


.uk-card-body{
    padding: 15px 8px !important;
}
form{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
}
.section-data{
    border: 1px solid #ccc;
    padding: 10px;
    width: 100%;
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
    width: 47%
}
.files-container{
    width: 100%;
    min-height: 40px;
    border: 1px solid rgb(133, 133, 133);
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
}
.add-file{
    height: 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 18px;
}
.plus{
    color: rgb(55, 55, 163);
    font-size: 18px;
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
.isEmpty{
    border: 1px solid rgb(255, 38, 38) !important;
}
.DisabledBtn{
    pointer-events: none;
    background: rgb(255, 255, 255);
    border: 1px solid #333;
    color: #000
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
#file{
    width: 20px;
    opacity: 0;
}
.product-file{
    margin: 5px;
    display: flex;
    border-radius: 5px;
    padding: 5px;
    border: 1px solid #ccc;
}
.icon-file{
    position: relative;
    font-size: 14px;
    top: 4px;
    font-size: 17px;
    margin-left: 20px;

}





.modal {
  width: 500px;
  margin: 0px auto;
  padding: 20px 15px;
  margin: 0px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 3px;
  transition: all 0.2s ease-in;
  font-family: Helvetica, Arial, sans-serif;
}
.modal .item{
    width: 47%;
}
.fadeIn-enter {
  opacity: 0;
}

.fadeIn-leave-active {
  opacity: 0;
  transition: all 0.2s step-end;
}

.fadeIn-enter .modal,
.fadeIn-leave-active.modal {
  transform: scale(1.1);
}


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #00000094;
  z-index: 999;
  transition: opacity 0.2s ease;
}
.disabled-item{
    pointer-events: none;
    background: #f2f2f2;
}
.icon-disabled{
    color: #868484;
    pointer-events: none;
}
</style>