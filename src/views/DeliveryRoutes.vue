<template>
  <div class="uk-flex uk-flex-column cnt">
    <ion-loading :is-open="isOpenRef" cssClass="my-custom-class" message="Por favor Espere..." :duration="timeout"
      @didDismiss="setOpen(false)">
    </ion-loading>
    <div class="stiky">
      <p class="web-font-small" style=" font-size: 13px; font-weight: 500">
        {{loadStore?.loadNumber}}
      </p>
      <div class="
          uk-flex
          uk-flex
          uk-flex-center
          uk-flex-left
          uk-margin-remove
          uk-padding-remove
        " style="align-items: center;">
        <div class="uk-flex uk-flex-wrap web-font-small">
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium ">Shipper: </span><span>&nbsp; {{ shipperName(loadStore) }}</span>
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span><span>&nbsp; {{ loadStore?.firstOrdenInfo?.sector }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="container-deliver">
      <header>
        <div uk-margin class="sub-header">
          <div class="filter-checkbox ">
            <span class="filter-message web-font-small">
              Ver Ordenes: &nbsp; Pendientes
            </span>
            <div class="onoffswitch">
              <input type="checkbox" v-model="filterOrders" name="onoffswitch" class="onoffswitch-checkbox"
                id="myonoffswitch" tabindex="0" />
              <label class="onoffswitch-label" for="myonoffswitch"></label>
            </div>
            <span class="filter-message web-font-small">
              Todas
            </span>
          </div>

        </div>
      </header>
      <div class="uk-padding-small uk-width-1-1 container-item">
        <div v-for="order in ordersToDisplay" :key="order"
          class="uk-card item-deliver uk-card-default uk-card-body uk-flex"
          :class="{ ordenCompleted: order.completed, 'order-status': order?.status === 'Delivered' }">
          <div v-if="order.sendingInfo || order.status === 'Delivered'" class="order-completed">
            <font-awesome-icon icon="check" />
          </div>
          <div v-else-if="load.allowOrderChangesAtDelivery === true" class="order-select">
            <input @click="orderForScanInvoices(order)" name="radio2" type="checkbox" class="uk-checkbox"
              v-model="order.isSelectedDeliver">
          </div>
          <div v-else class="order-select">
            <input @click="orderForScan(order)" v-model="order.isSelectedDeliver" type="checkbox" class="uk-checkbox">
          </div>
          <div class="uk-text-left info-user ">
            <div class="btn uk-flex">
              <div class="uk-flex uk-flex-column uk-text-left">
                <p v-if="order.sendingInfo && order.status !== 'Delivered'" class="uk-width-1-1">
                  <strong class="font-weight-medium web-font-small">Enviando Informacion</strong>
                </p>
                <p class="uk-width-1-1 web-font-small">
                  <span class="font-weight-medium ">Cliente: </span>
                  <span>{{ order.client_name }}</span>
                </p>
              </div>
            </div>

            <p style="margin-right: 10px !important" class="web-font-small">
              <span class="font-weight-medium">Orden: </span><span>{{ order.order_num }}</span>
            </p>
            <div class="uk-flex uk-flex-wrap web-font-small">
              <p>
                <span class="font-weight-medium">Cajas / Pallets: </span><span>{{order?.no_of_boxes}}</span>
              </p>
              <p class="web-font-small">
                <span class="font-weight-medium uk-margin-medium-left">Escaneadas: </span><span
                  :class="{'order-delivered': order?.status === 'Delivered'}">{{order.totalOrdersScanned}}/{{order.totalQuantity}}
                </span>
              </p>
            </div>
            <p class="uk-width-1-1 web-font-small">
              <span class="font-weight-medium">Destino: </span>
              <span>
                <font-awesome-icon icon="map-marker-alt" /> {{ order.address}}
              </span>
            </p>

          </div>

          <div style="width: 100%">
            <ul uk-accordion class="uk-margin-remove uk-padding-remove">
              <!-- uk-open -->
              <li class="uk-margin-remove">
                <a class="uk-accordion-title web-font-small" href="#" @click="changeText(order.order_num)">{{ order.textAccordionProduct  }}</a>
                <div class="uk-accordion-content uk-margin-remove uk-padding-remove">
                  <div class="details-product">
                    <p class="item web-font-small">
                      <span class="font-weight-medium">Producto: </span>
                    </p>
                    <p class="item web-font-small">
                      <span class="font-weight-medium">Codigo QR: </span>
                    </p>
                    <p class="item web-font-small">
                      <span class="font-weight-medium">Escaneadas: </span>
                    </p>
                  </div>
                  <div v-for="item in order.products" :key="item.id" class="details-product">
                    <p class="item web-font-small font-small">{{item?.description}}</p>
                    <p class="item web-font-small font-small">{{item.qrCode}}</p>
                    <p class="item web-font-small font-small">{{item.loadScanningCounter}}/{{item.quantity}}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>


        </div>

      </div>
    </div>
    <div class="button-opt">
      <button @click="screenSelection()" :disabled="!showButton"
        class="uk-button uk-button-primary web-font-small">{{textButton}}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { IonLoading } from "@ionic/vue";
import { ref } from "vue";
import { Mixins } from '../mixins/mixins'
import axios from "axios";
import { hostEnum } from '../types'
export default {
  alias: 'Entregar Ordenes',
  mixins: [Mixins],
  components:{
    IonLoading
  },
   setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  data() {
    return {
      hostEnum,


      status: null,
      load: null,
      orders: null,
      completed: "background-color: #2a307c !important",
      listOfOrders: [],
      listOrderDetails: [],
      listOfOrderTotal: [],
      showButton: false,
      textButton: null,
      timeout: 10000,
      idOrderToInvoices: null,
      ordersToDisplay: [],
      filterOrders: false,
      textAccordionProduct: 'Mostrar Productos'

    };
  },
 
  watch:{
    listOfOrders:{
      handler: function (newVal) {
       if (newVal.length === 0) {
       this.showButton = false
      } else {
       this.showButton = true
      }
      }, deep: true
    },
    filterOrders: function(newVal){
      this.filterByOrders(newVal)
    },
    orders:{
      handler: function (newVal) {
        if(newVal.every(x => x.isSelectedDeliver == true)){
          this.selectAllOrders = true
        }else{
          this.selectAllOrders = false
        }
      }, deep: true
    },
  },
  computed: {
    ...mapGetters(["loadStore", "orderScan","orderDetailsStore","isSelectedInvoicesStore", "structureToScan", "invoicesIdStore"]),

  },
  async mounted() {
    this.setOpen(true)
    try{
      this.load = await this.$services.loadsServices.getLoadDetails(this.loadStore.loadMapId); 
      this.load.firstOrdenInfo = this.loadStore?.Orders[0]
      
    }catch(error){
      if (this.loadStore?.loadMapId) {
      this.load = {...this.loadStore};
      } else {
        this.load = JSON.parse(localStorage.getItem('DeliveryCharges'));
      }
    }
    this.$store.commit("setloadStore", this.load)
    this.orders = this.load?.Orders
    this.load.firstOrdenInfo = this.load?.Orders[0]
    this.orders = this.load?.Orders


    if(localStorage.getItem('sendInfoOrders')){

      let sendingInfoOrders = JSON.parse(localStorage.getItem('sendInfoOrders'))

      let failSendInfo
      
      JSON.parse(localStorage.getItem('failSendInfo')) ?
      failSendInfo = JSON.parse(localStorage.getItem('failSendInfo'))
      : false

      this.orders?.forEach(order => {
          order.sendingInfo = sendingInfoOrders?.some(x => x == order.order_num) 
          
          if((order?.status == 'Delivered' && order?.sendingInfo) || failSendInfo){
              order.sendingInfo = false

              let orders = []
              if(localStorage.getItem('sendInfoOrders')){
                orders = JSON.parse(localStorage.getItem('sendInfoOrders'))
              }

              let orderForDelete = orders?.findIndex(x => x == order?.order_num)

              if(orderForDelete > -1){
                orders.splice(orderForDelete, 1)
              }

              localStorage.setItem('sendInfoOrders', JSON.stringify(orders))

              localStorage.removeItem('failSendInfo')

          }

          
      })
    }
    this.orders?.forEach(order => {
      order.textAccordionProduct = 'Mostrar Productos'
    })

    this.filterByOrders(false)
    this.setOpen(false)
    if (this.load.allowOrderChangesAtDelivery) {
     this.textButton = 'Entregar la Orden y Factura'
    } else {
     this.textButton = 'Escanear y Entregar Productos'
    }
   this.orders.map(x => {
        x.totalQuantity = 0
        x.totalOrdersScanned = 0
        
        x.products.forEach(z => { 
          x.totalQuantity +=  z.quantity 
          x.totalOrdersScanned += z.loadScanningCounter
        })
      })
      if (this.orderDetailsStore ) {
        this.orderDetailsStore.forEach(x => {
          this.orders.forEach(order => {
           if (!order.sendingInfo && order.order_num === x.order_num && !(order.products.every(prod => prod.loadScanningCounter >= prod.quantity))) {
             order.isSelectedDeliver = true
             this.orderForScan(order)
           } 
          })
        })
      }
    if (this.invoicesIdStore.orderId) {
      this.idOrderToInvoices = this.invoicesIdStore.orderId
      }
      this.$store.commit("getInvoiceDownload",{ status: false, order: null});
  },
  methods: {
    
   async screenSelection () {
      this.showButton = false 
      if (this.load.allowOrderChangesAtDelivery) {
        let searchId = []
        for (let i = 0; i < this.idOrderToInvoices.length; i++) {
          if ((this.idOrderToInvoices[i] != "0" || searchId.length > 0) && this.idOrderToInvoices[i] != "S") {
            searchId.push(this.idOrderToInvoices[i])
          }
        }
       let odooIds = {
         orderId: searchId.join(''),
          loadsId: this.load.loadMapId
        }

        this.$store.commit("getOrdersToInvoicesId", odooIds)
        localStorage.setItem("getOrdersToInvoicesId", JSON.stringify(odooIds))
      }
        this.scan()

    },
    async scan() {
      let structure = {firstStructure: this.listOfOrders, secondStructure: this.listOfOrderTotal}
      this.$store.commit("setStructureToScan", structure)
      localStorage.setItem("setStructureToScan", JSON.stringify(structure))
      localStorage.setItem(`allProducts${this.load.loadMapId}`, JSON.stringify(this.orders))
      localStorage.setItem("scanOrder", JSON.stringify(this.listOrderDetails))
      this.$store.commit("scanOrder", this.listOrderDetails );
      this.$store.commit("setOrderDetails", this.listOrderDetails );

      let ordersMissing = []
      if(!localStorage.getItem(`ordersMissing${this.load.loadMapId}`)){
          for (let i = 0; i < this.orders.length; i++) {
            const order = this.orders[i];
            if(order.status != 'Delivered') ordersMissing.push(order.order_num)
          }
          localStorage.setItem(`ordersMissing${this.load.loadMapId}`, JSON.stringify(ordersMissing) )
      }

      if(this.load?.scanningRequired){
        this.$router.push({ name: "deliveryActions" }).catch(() => {});
      }else{
        this.$router.push({ name: "delivery-actions-auto" }).catch(() => {});
      }

      if (this.load.allowOrderChangesAtDelivery) {
        await this.productsOfOrdersToOdoo()
      }
    },

    shipperName(val){
      var shipper = val?.shipper?.find(x => x.name)
      return shipper?.name
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
   async orderForScanInvoices (order) {
    if(this.listOrderDetails.some(x=> x.order_num === order.order_num)) {
      this.listOrderDetails = []
      this.listOfOrders = []
      this.listOfOrderTotal = []
      this.$store.commit("setStructureToScan", [])
      this.$store.commit("scanOrder", [] );
      this.$store.commit("setOrderDetails", [] );
    }
    else {
      this.orders.forEach(x => {
        x.isSelectedDeliver =   x.order_num === order.order_num
      })
      this.showButton = true
      this.idOrderToInvoices = order.order_num
      this.listOrderDetails = [order]
       let structure = await this.setStructure(order)
      this.listOfOrders = structure.firstStructure
      this.listOfOrderTotal = structure.secondStructure
      let OrderStructur = {firstStructure: this.listOfOrders, secondStructure: this.listOfOrderTotal}
      this.$store.commit("getSelectedInvoices", order)
      this.$store.commit("setStructureToScan", OrderStructur)
       localStorage.setItem(`allProducts${this.load.loadMapId}`, JSON.stringify(this.orders))
      this.$store.commit("scanOrder", this.listOrderDetails );
      this.$store.commit("setOrderDetails", this.listOrderDetails );
     }
  },

    filterByOrders(val) {
      if(val){
        this.ordersToDisplay = this.orders
      }else{
        this.ordersToDisplay = this.orders.filter(order => order.status != 'Delivered')
      }
    },

    changeText(name) {
      this.ordersToDisplay.forEach(order => {
        if (order.order_num === name) {
          if (order.textAccordionProduct !== 'Mostrar Productos') {
            order.textAccordionProduct = 'Mostrar Productos'
          } else {
            order.textAccordionProduct = 'Ocultar Productos'
          }
        }
      })
    },

    async productsOfOrdersToOdoo() {
      try {
        this.setOpen(true);
        let idInvoices = {}

        if (this.invoicesIdStore.orderId) {
          idInvoices = this.invoicesIdStore
        } else {
          idInvoices = JSON.parse(localStorage.getItem("getOrdersToInvoicesId"))
        }
        let orderStoreQuantity = []
        const result = await axios.get(`${hostEnum?.odoo}/api/order/${idInvoices.orderId}/`, { withCredentials: true });
        this.order_linesOdoo = result.data.result.data.order_lines;
        let customerDetails = await result.data.result.data;
        if (customerDetails.invoices.length > 0) {
          let selectedInvoicesId = [];
          customerDetails.invoices.forEach((x) => {
            selectedInvoicesId.push(x.id.toString());
          });

          let downloadInvoicesId = selectedInvoicesId.join();

          this.$store.commit("getInvoiceDetails", downloadInvoicesId);
          localStorage.setItem('invoiceDetails', JSON.stringify(downloadInvoicesId));
        }
        this.order_linesOdoo.forEach(
          (x, i) => {
            orderStoreQuantity = this.orderScan[i]?.products
            this.productOrder = x;
            if (orderStoreQuantity) {
              if (orderStoreQuantity?.some(order => order.name == x.productId && order.quantity !== x.qty_to_deliver)) {
                let isChangeQuantity = {
                  exception: true,
                  changeQuantity: x.qty_to_deliver,
                  order_num: customerDetails?.order?.name
                }
                localStorage.setItem(
                  `isChangeQuantity${customerDetails?.order?.name}`,
                  JSON.stringify(isChangeQuantity)
                );
                this.$store.commit(
                  "getChageQuantityToProduct",
                  isChangeQuantity
                );

              } else if (
                this.order_linesOdoo.every((x) => orderStoreQuantity?.some(order => order.name == x.productId && order.quantity === x.qty_to_deliver))
              ) {
                localStorage.removeItem(
                  `isChangeQuantity${this.orderScan[0].order_num}`
                );
                this.$store.commit("getChageQuantityToProduct", {
                  exception: false,
                  changeQuantity: null,
                  order_num: null,
                });
              }
            }
          }
        );

        await  this.setStructureInvoices(null, this.productOrder);

      } catch (error) {
        console.log(error);
      }
      this.setOpen(false);

    },

    async setStructureInvoices(quantity, product) {
      let structure = await this.setStructure(
        this.orderScan[0],
        [],
        [],
        quantity,
        product,
        this.order_linesOdoo
      );
      let listOfOrders = structure.firstStructure;
      let listOfOrderTotal = structure.secondStructure;
      let structureInvoices = {
        firstStructure: listOfOrders,
        secondStructure: listOfOrderTotal,
      };
      this.$store.commit("setStructureToScan", structureInvoices);
      localStorage.setItem("setStructureToScan", JSON.stringify(structureInvoices))

    },

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
  margin: 5px  0px;
  font-size: 12px;
  color: #3880ff;
  padding: 5px;

}
.uk-accordion-title::before {
    content: "";
    margin-left: 7px;
    background-image: url('../assets/down.png');
    height: 17px;
    background-size: 14px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    padding-right: 18px;
}
.uk-open>.uk-accordion-title::before {
  transform: rotate(180deg);
}
.order-select{
  width: 5%;
  display: flex;
  padding: 8px 0px;
  max-width: 25px;
  min-width: 16px;

  margin-right: 5px;
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
.order-completed{
  color: green;
  font-size: 16px;
  margin-right: 5px
}
.order-delivered{
  font-weight: 700;
  color: green
}

header {
  height: 60px;  /* 64 + 16px */
  position: sticky;
  -webkit-position: sticky;
  top: -16px; 
  z-index: 1;
  text-align: center;
  -webkit-backface-visibility: hidden;
}

header::before,
header::after {
  content: '';
  display: block;
  height: 16px;
  position: sticky;
  -webkit-position: sticky;
}

/* SHADOW */
header::before {
  top: 28px; /* shadow is at bottom of element, so at 48 + 16 = 64px */
  box-shadow: 0px 0px 2px rgba(0,0,0,0.5);
}

/* COVER */
header::after {
  background: linear-gradient(white 10%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.4) 70%, transparent);
  z-index: 2;
}

/* HEADER CONTENT */
header >.sub-header {
  background: rgb(255, 255, 255);
  height: 44px;
  position: sticky;
  -webkit-position: sticky;
  top: 0px;
  margin-top: -16px;
  /* content should fall over shadow and cover */
  z-index: 3;
}
.onoffswitch-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.onoffswitch-label {
  position: relative;
  top: 3px;
  display: block;
  overflow: hidden;
  cursor: pointer;
  height: 22px;
  padding: 0;
  line-height: 36px;
  border: 2px solid #e3e3e3;
  border-radius: 36px;
  background-color: #ffffff;
  transition: background-color 0.3s ease-in;
}
.onoffswitch-label:before {
  content: "";
  display: block;
  width: 20px;
  margin: 0px;
  background: #ffffff;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 19px;
  border: 2px solid #e3e3e3;
  border-radius: 36px;
  transition: all 0.3s ease-in 0s;
}
.onoffswitch-checkbox:checked + .onoffswitch-label {
  background-color: #02cf13;
}
.onoffswitch-checkbox:checked + .onoffswitch-label,
.onoffswitch-checkbox:checked + .onoffswitch-label:before {
  border-color: #02cf13;
}
.onoffswitch-checkbox:checked + .onoffswitch-label:before {
  right: 0px;
}
.onoffswitch{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50px;
}

.filter-checkbox{
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
  width: 100% !important
}
.filter-message{
  padding: 9px;
  font-size: 10px;
  font-weight: 600;

}
.uk-padding-small{
  padding: 0px 15px 15px;
}
.container-item{
    margin-bottom:40px
}
.font-small {
  font-size: 10px;
}
@media (min-width: 600px){
  .filter-checkbox{
    justify-content: start;
  }
  .container-deliver{
    width: 90%;
    margin: 10px auto
  }
  .container-item{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 45px!important;
  }
  .item-deliver{
    width: 100%;
  }
}
@media (min-width: 900px){
  .item-deliver{
    width: 49%;
  }
}
</style>
