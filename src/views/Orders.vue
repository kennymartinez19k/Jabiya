<template>
  <div class="uk-flex uk-flex-column cnt">
    <div class="stiky">
      <p
        style=" font-size: 13px !important; font-weight: 500"
      >
        {{load?.loadNumber}}
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
            <span class="font-weight-medium">Shipper: </span><span>&nbsp; {{ shipperName(load) }}</span>      
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span><span>&nbsp; {{ load?.firstOrdenSector }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="uk-padding-small uk-width-1-2@m" style="margin-bottom: 50px!important;">
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
        <div class="uk-text-left info-user uk-flex uk-flex-wrap">
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
          <p class="">
            <span class="font-weight-medium">Cajas / Pallets: </span>{{order?.no_of_boxes}}<span></span>
          </p>
          <p class="uk-width-1-1">
            <span class="font-weight-medium">Destino: </span> 
            <span> <font-awesome-icon icon="map-marker-alt" /> {{ order.sector}}</span>
          </p>
        </div>
        <div>
          <input @click="orderForScan(order)" v-model="order.isSelected" type="checkbox" class="uk-checkbox" >
        </div>
        
      </div>
      
    </div>
    <div></div>
      <div class="button-opt">
      <button @click="scan()" class="uk-button uk-button-transparent">Escanear y Cargar Camion
          <img src="../assets/load-truck.png" style="width: 25px; margin-left: 5px ">
      </button>
      
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  alias: `Montar Viaje`,
  name: `cargarrr`,
  data() {
    return {
      status: null,
      result: null,
      load: null,
      completed: "background-color: #2a307c !important",
      orders: null,
      listOfOrders: [],
      listOfOrderTotal: [],
      listOrderDetails: [],
      selectAllOrders: false
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
    }
  },
  mounted() {
    if(this.loadStore){
      this.load = this.loadStore;
      this.orders = this.loadStore.Orders
      this.orders.map(x => x.isSelected = false)
      this.load.firstOrdenSector = this.orders[0]?.sector
      console.log(this.load)
    }else{
      this.load = this.allLoadsStore
    this.orders = this.load.orders

    }
    this.orderObj();

  
      
  },
  methods: {
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
      let structureInfo = {firstStructure: this.listOfOrders, secondStructure: this.listOfOrderTotal}
      let allProducts = []
      for (let i = 0; i < this.orders.length; i++) {
        const order = this.orders[i];
        allProducts.push(order.order_num)        
      }
      localStorage.setItem(`allProducts${this.load.loadMapId}`, JSON.stringify(allProducts))
      this.$store.commit("setStructureToScan", structureInfo)
      this.$router.push({ name: "scan-order" }).catch(() => {});
    },
    
    async orderForScan(order, allOrders = false){
      let firstProductInfo;
      let totalOfOrders = 0;
     if(this.listOfOrders.some(x => x.order_num == order.order_num) && !allOrders){
       this.listOrderDetails = this.listOrderDetails.filter(x => x.order_num != order.order_num)
       this.listOfOrders = this.listOfOrders.filter(x => x.order_num != order.order_num)
       this.listOfOrderTotal = this.listOfOrderTotal.filter(x => x.order_num != order.order_num)
     }else{
       this.listOrderDetails.push(order)
       order.products.forEach(async x => {
         let {order_num, _id} = order
         let {name, qrCode, quantity, scanOneByOne, loadScanningCounter} = x 
         firstProductInfo = {order_num, name, _id, qrCode, quantity, scanOneByOne, loadScanningCounter}       
         this.listOfOrders.unshift(firstProductInfo)
       })
     
        this.listOfOrders.forEach( x => {
         let {qrCode,  loadScanningCounter, order_num} = x
          var productQrCode = this.listOfOrders.filter( p => p.qrCode == x.qrCode )
           if(productQrCode){
             productQrCode.forEach(product => {
               totalOfOrders += product.quantity
             })
           }
           let SecondProductInfo = {order_num, qrCode, totalOfOrders, loadScanningCounter}
             this.listOfOrderTotal.unshift(SecondProductInfo)
             totalOfOrders = 0
        })
        
        let products = []
        this.listOfOrderTotal.forEach(x => {
          let product = products.find(p => p.qrCode == x.qrCode)
          if(product){
              if(x.totalOfOrders > product.totalOfOrders){
                  product.totalOfOrders = x.totalOfOrders
              }   
          }else{
              products.push(x)
          }
        })
        this.listOfOrderTotal = products
    }
  },

  shipperName(val){
      var shipper = val?.shipper?.find(x => x)
      return shipper?.name
    },
    firstOrderSector(val){
      var shipper = val?.shipper?.find(x => x)
      return shipper?.name
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
  padding: 5px 5px;
  line-height: 15px;
}
.uk-card {
  padding: 20px 10px;
}
.uk-card-body {
  margin-bottom: 10px;
  align-items: center;
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
  padding: 10px 5px;
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
</style>
