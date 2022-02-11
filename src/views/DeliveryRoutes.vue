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
            <span style="font-weight: 500">Destino:</span><span>&nbsp; {{ load?.firstOrdenInfo?.sector }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="uk-padding-small uk-width-1-2@m" style="margin-bottom: 96px!important;">
      <div
        v-for="order in orders"
        :key="order"
        class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        :class="{ ordenCompleted: order.completed, 'order-status': order?.totalOrdersScanned === order?.totalQuantity }"
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
          <p>
            <span class="font-weight-medium">Cajas / Pallets: </span><span>{{order?.no_of_boxes}}</span>
          </p>
          <p>
            <span class="font-weight-medium uk-margin-medium-left">Escaneadas: </span><span>{{order?.totalOrdersScanned}}/{{order.totalQuantity}} </span>
          </p>
          </div>
          <p class="uk-width-1-1">
            <span class="font-weight-medium">Destino: </span> 
            <span> <font-awesome-icon icon="map-marker-alt" /> {{ order.address}}</span>
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
                        <p class="item">{{item.loadScanningCounter}}/{{item.quantity}}</p>
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
import { Geolocation } from "@capacitor/geolocation";
import { mapGetters } from "vuex";
export default {
  alias: 'Entregar Ordenes',
  data() {
    return {
      status: null,
      result: null,
      load: null,
      orders: null,
      completed: "background-color: #2a307c !important",
      listOfOrders: [],
      listOrderDetails: [],
      listOfOrderTotal: [],
      showButton: true,

    };
  },
  watch:{
    listOfOrders:{
      handler: function (newVal) {
       if (newVal.length === 0) {
       this.showButton = true
      } else {
       this.showButton = false
      }
      }, deep: true
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
  },
  computed: {
    ...mapGetters(["loadStore", "orderScan","orderDetailsStore"]),

  },
  mounted() {
    this.load = this.loadStore;
    this.load.firstOrdenInfo = this.load?.Orders[0]
    this.orders = this.load?.Orders
    console.log(this.orders, 'orders')
   this.orders.map(x => {
      x.isSelected = false
        x.totalQuantity = 0
        x.totalOrdersScanned = 0
        x.products.forEach(z => { 
          x.totalQuantity =+  z.quantity 
          x.totalOrdersScanned += z.loadScanningCounter
        })
      })
      if (this.orderDetailsStore) {
        this.orderDetailsStore.forEach(x => {
          this.orders.forEach(order => {
           if (order.order_num === x.order_num) {
            this.orderForScan(order)
           } 
          })
        })
      }
  },
  methods: {
    async location () {
        try {
          const geo = await Geolocation.getCurrentPosition();
          this.location1.latitude = geo.coords.latitude
          this.location1.longitude = geo.coords.longitude
        } catch (e) {
          console.log(e)
        
        }
    },
    async scan() {
      this.$store.commit("scanOrder", this.listOrderDetails );
      this.$store.commit("setOrderDetails", this.listOrderDetails );
      this.$router.push({ name: "deliveryActions" }).catch(() => {});
    },
    shipperName(val){
      var shipper = val?.shipper?.find(x => x.name)
      return shipper?.name
    },
  
    async orderForScan(order, allOrders = false){
      let totalOfOrders = 0;
    
      if(this.listOfOrders?.some(x => x.order_num == order?.order_num) && !allOrders){
        this.listOrderDetails = this.listOrderDetails.filter(x => x?.order_num != order?.order_num)
        this.listOfOrders = this.listOfOrders.filter(x => x?.order_num != order?.order_num)
        this.listOfOrderTotal = this.listOfOrderTotal.filter(x => x.order_num != order?.order_num)
      }
      else{
        this.listOrderDetails.push(order)
        let num_id = 0
        order?.products?.forEach(async x => {
          num_id++
          let {order_num, _id} = order
          let {name, qrCode, quantity, scanOneByOne, loadScanningCounter} = x 
          loadScanningCounter = 0
          let firstProductInfo = {order_num, name, _id, qrCode, quantity, scanOneByOne, loadScanningCounter, num_id}       
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
          loadScanningCounter = 0
          let SecondProductInfo = {order_num, qrCode, totalOfOrders, loadScanningCounter}
          this.listOfOrderTotal.unshift(SecondProductInfo)
          totalOfOrders = 0
        })


      let structureInfo = {firstStructure: this.listOfOrders, secondStructure: this.listOfOrderTotal}
      let allProducts = []
      for (let i = 0; i < this.orders.length; i++) {
        const order = this.orders[i];
        allProducts.push(order.order_num)        
      }
      
      localStorage.setItem(`allProducts${this.load.loadMapId}`, JSON.stringify(allProducts))
      this.$store.commit("setStructureToScan", structureInfo)

      }
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
  },
};
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
  background: rgba(18, 216, 18, 0.6);
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
.order-status{
  background: #e0fae080;
}
</style>
