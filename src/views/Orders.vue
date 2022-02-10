<template>
  <div class="uk-flex uk-flex-column cnt">
    <div class="stiky">
      <p
        style=" font-size: 13px !important; font-weight: 500"
      >
        {{loadStore?.loadNumber}}
      </p>
      <div
        class="
          uk-flex
          uk-flex
          uk-flex-center
          uk-flex-left
          uk-margin-remove
          uk-padding-remove
        "
        style="align-items: center;"
      >
        <div class="uk-flex uk-flex-wrap">
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Shipper: </span><span>&nbsp; {{ shipperName(loadStore) }}</span>      
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span><span>&nbsp; {{ loadStore?.firstOrdenInfo.sector }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="uk-padding-small uk-width-1-2@m" style="margin-bottom: 96px!important;">
      <div class="uk-flex select-all">
        <input  type="checkbox" class="uk-checkbox" v-model="selectAllOrders" id="all-orders"> &nbsp;
        <label for="all-orders"><strong>Seleccionar Todas las Ordenes </strong></label>
      </div>
      <div
        v-for="order in orders"
        :key="order"
        class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        :class="{ ordenCompleted: order.completed }"
      >
        <div class="order-select">
          <input @click="orderForScan(order)" v-model="order.isSelected" type="checkbox" class="uk-checkbox" >
        </div>
        <div class="uk-text-left info-user ">
          <div class="btn uk-flex">
            <div class="uk-flex uk-flex-column uk-text-left">
              <span
                v-if="order.completed"
                style="
                  display: flex;
                  position: relative;
                  top: -4px;
                  color: green;
                "
              >
                <strong>Completado </strong>
                <font-awesome-icon
                  icon="check"
                  style="font-size: 14px; margin: 3px"
                />
              </span>
              <p
                class="uk-width-1-1"
              >
              <span class="font-weight-medium">Cliente: </span>
                <span>{{ order.client_name }}</span>
              </p>
            </div>
          </div>
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Orden: </span><span>{{ order.order_num }}</span>
          </p>
          <div class="uk-flex uk-flex-wrap">
          <p class="">
            <span class="font-weight-medium">Cajas / Pallets: </span><span>{{order?.no_of_boxes}}</span>
          </p>
          <p class="">
            <span class="font-weight-medium uk-margin-medium-left">Escaneadas: </span><span>{{totalOrdersScanned(order)}}</span>
          </p>
          </div>
          <p class="uk-width-1-1">
            <span class="font-weight-medium">Destino: </span> 
            <span> <font-awesome-icon icon="map-marker-alt" /> {{ order.sector}}</span>
          </p>
           
        </div>
        <div style="width: 100%">
            <ul uk-accordion class="uk-margin-remove uk-padding-remove">
               <!-- uk-open -->
                <li class="uk-margin-remove">
                   <a class="uk-accordion-title " href="#"></a>
                    <div 
                     class="uk-accordion-content uk-margin-remove uk-padding-remove">
                     <div class="details-product">
                      <p class="item">
                        <span class="font-weight-medium">Producto: </span>
                      </p>
                      <p class="item">
                        <span class="font-weight-medium">Codigo QR: </span>
                      </p>
                      <p class="item">
                        <span class="font-weight-medium">Escaneadas: </span>
                      </p>
                     </div>
                      <div v-for="item in order.products" :key="item.id" class="details-product">
                        <p class="item">{{item?.name}}</p>
                        <p class="item">{{item.qrCode}}</p>
                        <p class="item">{{totalOrdersScanned(order)}}</p>
                      </div>
                    </div>
                </li>
            </ul>
        </div>
      </div>
      
    </div>
      <div class="button-opt">
      <button @click="scan()" :disabled="showButton === true" class="uk-button uk-button-primary">Escanear y Cargar Camion
      </button>
      
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Mixins} from '../mixins/mixins'
import UIkit from "uikit";

export default {
  alias: `Montar Viaje`,
  name: `cargarrr`,
  mixins: [Mixins],
  data() {
    return {
      status: null,
      showButton: true,
      load: null,
      completed: "background-color: #2a307c !important",
      orders: null,
      listOfOrders: [],
      listOfOrderTotal: [],
      listOrderDetails: [],
      selectAllOrders: false,
    };
  },
  
  computed: {
    ...mapGetters(["loadStore", "orderScan", 'loads', "allLoadsStore", "products", "structureToScan"])
  },
  watch:{
    selectAllOrders: function(newVal){
        if(newVal == true){
            this.orders.forEach( x => {
            if(!x.isSelected){
              x.isSelected = true
              this.orderForScan(x)
            }
          })
        }else{
            if(this.orders.every(order => order.isSelected)){
              this.orders.map(x => x.isSelected = false)
              this.orders.forEach(x => {
                this.listOrderDetails = this.listOrderDetails.filter(p => p.order_num != x.order_num)
                this.listOfOrders = this.listOfOrders.filter(p => p.order_num != x.order_num)
                this.listOfOrderTotal = this.listOfOrderTotal.filter(p => p.order_num != x.order_num)
              })
              
            }
          }
    },
    orders:{
      handler: function (newVal) {
        if(newVal.every(x => x.isSelected == true)){
          this.selectAllOrders = true
        }else{
          this.selectAllOrders = false
        }
      }, deep: true
    },
     listOfOrders:{
      handler: function (newVal) {
       if (newVal.length === 0) {
       this.showButton = true
      } else {
       this.showButton = false
      }
      }, deep: true
    }
  },
  async beforeMount(){
    
  },
  async mounted() {
    this.load = {...this.loadStore};
    console.log(this.loadStore)
    this.load = await this.$services.loadsServices.getLoadDetails(this.load.loadMapId);
    this.orders = [...this.load.Orders]
      this.orders?.map(x => x.isSelected = false)
      this.load.firstOrdenSector = this.orders[0]?.sector
      this.orderObj();

  },
  methods: {
    accordiontn () {
      UIkit.accordion('#accordion').show()
    },
    orderObj() {
      this.orders.sort((a) => {
        if (a.completed == true) {
          return 1;
        } else {
          return -1;
        }
      });
    },
   
    scan() {
      this.$emit("setNameHeader", 'Escaneo Corrido');
      this.$store.commit("scanOrder", this.listOrderDetails );
      let allProducts = []
      let structure = {firstStructure: this.listOfOrders, secondStructure: this.listOfOrderTotal}
      for (let i = 0; i < this.orders.length; i++) {
        const order = this.orders[i];
        allProducts.push(order.order_num)        
      }
      localStorage.setItem(`allProducts${this.load.loadMapId}`, JSON.stringify(allProducts))
      this.$store.commit("setStructureToScan", structure)
      this.$router.push({ name: "scan-order" }).catch(() => {});
    },
    
    async orderForScan(order, allOrders = false){
     if(this.listOfOrders.some(x => x.order_num == order.order_num) && !allOrders){
       this.listOrderDetails = this.listOrderDetails.filter(x => x.order_num != order.order_num)
       this.listOfOrders = this.listOfOrders.filter(x => x.order_num != order.order_num)
       this.listOfOrderTotal = this.listOfOrderTotal.filter(x => x.order_num != order.order_num)
     }else{
       this.listOrderDetails.push(order)
       let structure = await this.setStructure(order, this.listOfOrders, this.listOfOrderTotal)
       this.listOfOrders = structure.firstStructure
       this.listOfOrderTotal = structure.secondStructure
    }
  },

  shipperName(val){
      var shipper = val?.shipper?.find(x => x)
      return shipper?.name
    },
    firstOrderSector(val){
      var shipper = val?.shipper?.find(x => x)
      return shipper?.name
    },
    
  totalOrdersScanned(val){
    let structure = localStorage.getItem(JSON.stringify(this.load))
    let loadScanned = 0
    if(structure){
      structure?.firstStructure.forEach(prod => {
        if(prod.order_num == val.order_num) loadScanned += prod.loadScanningCounter
      })
    }
    return loadScanned
  }
}
}
</script>

<style scoped>
:root {
  --su-size-text: 12px;
}
.slideunlock .slideunlock-text{
  font-size: var(--su-size-text);
}
p {
  margin: 2px 0px !important;
}
.slide .slideunlock.is-complete .slideunlock-progressbar {
  background-color: #2a307c;
}
.button-opt {
  background: #ffffff !important;
  border-top: 1px solid #e2e2e2;
  width: 100%;
  position: absolute;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  padding: 10px 0px;
}
.button-opt button{
  line-height: 15px;
}
.uk-card {
  padding: 20px 10px;
}
.uk-card-body {
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding: 10px 11px;
  border: 0.1px solid #e5e5e5;
}
.slide {
  position: fixed;
  width: 97% !important;
  bottom: 5px;
  height: 40px;
  --su-size-text: 18px;
}
.status {
  font-size: 12px;
}
.btn {
  display: flex;
  align-items: baseline;
  width: 100%;
  justify-content: flex-start;
}
.btn img {
  width: 30px;
  position: relative;
  top: -2px;
  margin-left: 5px;
}

.scan-code img {
  width: 28px;
  position: relative;
  top: -2px;
  left: 4px;
}

.truckSpan {
  max-width: 100%;
}
.truck {
  max-width: 100%;
  width: 70px;
  display: flex;
}

.stiky {
  color: rgb(255, 255, 255) !important;
  z-index: 2;
    border-top: 1px solid #313575;
  font-size: 12px !important;
  padding: 0px 10px 5px !important;
 background: #2a307c;
 font-weight: 300 !important;
 text-align: center;
  box-shadow: 1px 0px 5px #898989;
}
.img-scan {
  width: 39px;
}
.icon-load {
  width: 35%;
  margin-right: 20px;
}
.btn-scan {
  margin-top: 12px;
  box-shadow: 0px -0.5px 3px #000;
  border: 0px;
  color: #fff;
  padding: 3px;
  background: #2a307c;
}

.info-header {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.info-user {
  padding-right: 5px;
  width: 90%;
}
.ordenCompleted {
  background: rgba(233, 255, 233, 0.6);
}
.box-slide {
  background-image: url('../assets/parcel.png');
    background-size: 25px 25px;
    background-repeat: no-repeat;
    background-position: 81%
}
.select-all{
  align-items: center;
  padding: 10px 11px;
}
.select-all input{
  transform: scale(1.1);
}
.select-all input :focus-visible {
    outline: 0px dotted #333;
}
.select-all label {
  font-weight: 600;
}
li{
  list-style-type: none;
}
.uk-accordion-title{
  display: flex;
  /* width: 100%; 
  display: inline-block;
  */
}
.uk-accordion-title::before {
    content: "";
    margin-left: 20px;/* revision*/
    background-image: url('../assets/down.png');
    height: 17px;
    background-size: 21px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}
.uk-open>.uk-accordion-title::before {
  background-image: url('../assets/up.png');
    height: 17px;
    background-size: 27px;
    background-position: 50% 50%;
    background-repeat: no-repeat
}
.order-select{
  width: 10%;
  display: flex;
  padding: 8px 0px;
}
.details-product{
  display: flex;
  justify-content: space-around;
}
.details-product .item{
  width: 33%;
}
</style>
