<template>
  <div class="container">
    <div class="stiky">
      <p
        class="web-font-small"
        style=" font-size: 13px; font-weight: 500"
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
        <div class="uk-flex uk-flex-wrap web-font-small">
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Shipper: </span><span>&nbsp; {{ shipperName(loadStore) }}</span>      
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span><span>&nbsp; {{ loadStore?.firstOrdenInfo ? loadStore?.firstOrdenInfo?.sector : loadStore.Orders[0].sector }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="allScreen">
      <div
      class="cont uk-card uk-card-default uk-card-hover uk-card-body"
      :class="{ statusError: statusOrders == 'reject', statusCheck: statusOrders == 'approve', webView: !isMobile }"
      style="z-index: 1; padding: 15px 0px !important"
    >
      <div v-if="statusOrders == 'start'">
     
        <p class="title-action web-font-small" style="margin: 5px 0px">
          
          <span v-if="isMobile">
            Escanee Ordenes
          </span>
          <span v-else>
            Introduzca su QrCode para cargar al camion
          </span>
          <img src="../assets/parcel.png" style="width: 10%; max-width: 40px">
        </p>
                
        <p v-if="orders.length <= 1 && isMobile" style="font-size: 14px">Escanee su QrCode para cargar al camion</p>
        
        <div v-else-if="isMobile" style="font-size: 13px">
        <span class="font-weight-medium">Ordenes: </span>
        <span v-for="(orden, i) of orders" v-show="i < 3" :key="orden" class="font-weight-medium">{{orden.order_num}}<span v-if="i < orders.length - 1">, </span></span>
        <span v-if="orders.length > 3">,....</span>
        </div>
         <div v-if="!isMobile" class="uk-flex uk-flex-center" style="margin-top: 10px">
          <input type="text" v-model="webQrCode" ref="email"  v-on:keyup.enter="uploadProducts(webQrCode)" class="uk-input uk-width-1-4 web-font-small">
          <button :disabled="webQrCode.length == 0" @click="uploadProducts(webQrCode)" class="uk-button uk-button-primary web-font-small" style="margin-left: 5px">Enviar</button>
         </div>
      </div>
      <div v-if="statusOrders == 'approve'" style="width: 100%; font-size: 30px">
          <img src="../assets/check.png" style="width: 35px" alt="">
          <h6 style="font-size: 14px" class="uk-margin-remove">{{completedOrder}}</h6>
        </div>
      <div v-if="statusOrders == 'reject'" style="width: 100%;; font-size: 30px">
          <h6 class="uk-margin-remove">{{messageReject}} <font-awesome-icon icon="ban" style="color: #be1515;"/>
          </h6>
      </div>
    </div>
     <div
        class="result-scan"
        :class="{checkScreen: checkOrder, banScreen: statusOrders == 'reject', finishCheck: statusOrders == 'approve'}"
      >
      <div v-if="statusOrders != 'approve' || checkOrders"></div>
      <div >
        <div v-if="checkOrder"  :class="{animationCheck: checkOrder}" class="check-all-Screen"></div>
      </div>
      <div v-if="statusOrders == 'reject'">
          <font-awesome-icon icon="ban" class="ban" />
      </div>
      <div v-if="statusOrders == 'approve'" id="list-completed" style="width: 95%; padding: 15px 0px; margin: 0px 10px">
        <ul class="uk-list uk-list-divider" style="list-style: none">
          <li v-for="orden in orders" :key="orden" class="article uk-card uk-card-default uk-card-body">
              <div>
                <p><strong>No. de Orden:</strong> &nbsp;  {{orden.order_num}}</p>
                <p class="uk-width-1-1">
                Destino: &nbsp;<span>{{
                  orden.sector
                }}</span>
              </p>
              </div>
              <div class="uk-flex uk-flex-column completed-card">
                <img src="../assets/check.png" class="icon-checked" alt="">
                <span>Completado</span>
              </div>
          </li>
        </ul>
      </div>
        <ul class="box-orden">
          <li v-for="product in firstStructureLoad" :key="product" 
              :class="{completedOrden: product.completedScanned, inProgressOrden: product.scanProgress}" style="">&nbsp;</li> 
        </ul>
      </div>
      <div>
    <transition name="modal">
      <div v-if="isOpen">
        <div class="overlay" @click.self="isOpen = false;">
          <div class="modal">
            <div class="">
            <button class="uk-modal-close-default" @click="scanOrder()" type="button" uk-close></button>
            <p style="font-size: 15px;">Cantidad (hasta el máximo de {{totalLimitOfBoxes - totalBoxesScanned}} <span id="total-quantity"></span>)</p>
            <input type="text" id="quantity" v-model="quantityForScan"  class="uk-input" >
            <p class="uk-text-right uk-flex uk-flex-around" style="margin-top: 20px !important;">
                <button class="uk-button uk-button-default uk-modal-close" style="margin: 0px 10px" @click="scanOrder()" type="button">Cancelar</button>
                <button :disabled="quantityForScan <= 0" class="uk-button uk-button-primary uk-modal-close" @click="sendQuantityForScan()" type="button">Guardar</button>
            </p>
        </div>
          </div>
        </div>
      </div>
    </transition>
  </div>

    </div>

  </div>
</template>

<script>





import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { mapGetters } from "vuex";
import { Vibration } from "@ionic-native/vibration";
import { Mixins } from '../mixins/mixins'

// import UIkit from "uikit";


export default {
  mixins: [Mixins],
  data() {
    return {
      isOpen: false,
      checkOrder: false,
      camera: "auto",
      statusOrders: 'start',
      quantityForScan: null,
      infoForScan: {},
      cont: 0,
      orders: [],
      firstStructureLoad: [],
      secondStructureLoad: [],
      load: [],
      showScanConfirmation: false,
      location1: {
        latitude: null,
        longitude: null,
      },
      counterScanned: 0,
      totalBoxesScanned: null,
      totalLimitOfBoxes: null,
      messageReject: null,
      modalDiv: null,
      btnDiv: null,
      spanDiv: null,
      webQrCode: "",
      isMobile: false
    };
  },
  computed: {
    ...mapGetters(["orderScan", "loadStore", "allLoadsStore", "structureToScan"]),
    completedOrder: function(){
      if(this.firstStructureLoad.every(x => x.completedScanned)){
        return 'TODAS LAS ORDENES HAN SIDO CARGADAS'
      }
      else{
        return 'LA ORDEN HA SIDO CARGADA'
      }
    }
  },
  watch:{
    isOpen: function(newVal){
      if(!newVal) this.scanOrder()
    },
    $route: function(newVal){
      if (newVal.name == 'scan-order'){
        this.stopScan()
      }
    },
      
    quantityForScan: function(newVal){
      if(newVal > (this.totalLimitOfBoxes - this.totalBoxesScanned)){
        this.quantityForScan = this.totalLimitOfBoxes - this.totalBoxesScanned
      }
    },

    firstStructureLoad:{
      handler: function (newVal) {
        if(newVal){
          this.firstStructureLoad.forEach(x => {
            x.completedScanned = x.loadScanningCounter >= x.quantity
            x.scanProgress = x.loadScanningCounter > 0 && !x.completedScanned
          })
          if(this.firstStructureLoad.every(x => x.completedScanned)){
            this.verifiedLoad()
          }
        }
      }, deep: true
    },
    secondStructureLoad:{
       handler: function (newVal) {
        if(newVal){
          this.secondStructureLoad.forEach(x => {
            x.completedScanned = x.loadScanningCounter >= x.quantity
            x.scanProgress = x.loadScanningCounter > 0 && !x.completedScanned
          })
        }
      }, deep: true
    }
  },
  async mounted() {
    try{
      const detectMob = () =>  {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];
        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem)
        });
      }
      this.isMobile = detectMob() && screen.width < 900

    }catch(error){
      alert(error.message)
    }
      BarcodeScanner.prepare();
      this.load = {...this.loadStore};
      this.orders = this.orderScan
      this.firstStructureLoad = this.structureToScan.firstStructure
      this.secondStructureLoad = this.structureToScan.secondStructure
      this.orders.map(x => x.completedScanned = false)

    
      let firstStructure = []
      let secondStructure = []
      this.firstStructureLoad.forEach(x => {
        let data = this.firstStructureLoad.find(p => p.qrCode === x.qrCode && p.quantity === x.quantity && p.order_num ==  x.order_num)
        if(!data) data = x
          data.completedScanned = data.loadScanningCounter == data.quantity
          data.scanProgress = data.loadScanningCounter > 0 && !data.completedScanned
          firstStructure.push(data)
      })
      this.secondStructureLoad.forEach(x => {
        let data = this.secondStructureLoad.find(p => p.qrCode === x.qrCode && p.totalOfOrders === x.totalOfOrders)
        if(!data) data = x
        data.completedScanned = data.loadScanningCounter == data.totalOfOrders
        data.scanProgress = data.loadScanningCounter > 0 && !data.completedScanned
        secondStructure.push(data)
      })

      
    this.firstStructureLoad = firstStructure
    this.secondStructureLoad = secondStructure

    // if (!this.loadStore.allowOrderChangesAtDelivery) {
      
    if(this.secondStructureLoad.every(x => x.completedScanned)){
      this.verifiedLoad()
    }else{
      this.scanOrder()
    }
    // }

    
  },


  methods: {  
    async uploadProducts(val){
      this.totalBoxesScanned = 0
      this.totalLimitOfBoxes = 0
      this.quantityForScan = null
     
      //   Compruebo si se encuentra el qrCode en la fila de la primera estructura

        let orderForScan = this.firstStructureLoad.find(
          x => x.qrCode == val &&
          x.loadScanningCounter < x.quantity &&
          !x.completedScanned
        )
        if(orderForScan){
          let detailsOrderToScan = this.secondStructureLoad.find(x => x.qrCode == orderForScan.qrCode)
          if(detailsOrderToScan.loadScanningCounter >= detailsOrderToScan.totalOfOrders ){
            this.messageReject = 'Ya estan escaneadas todas las productos con este qrcode'
            this.statusOrders = 'reject'
            Vibration.vibrate(1000);
            setTimeout(() => {
                this.statusOrders = 'start'
                this.scanOrder()
            }, 1000)
          }
          else{
            let order = this.load.Orders.filter(order => order.order_num === orderForScan.order_num)
            order = order.find(x => x)
            let productInfo = order.products.find(p => p?.qrCode == val && p?.quantity == orderForScan.quantity && orderForScan.order_num == order.order_num)
            if(productInfo?.scanOneByOne === "no") {
              let noScan1by1 = 0
              let scannedCounterNo1by1 = 0
              let listNoScan1by = this.firstStructureLoad.filter(x => x.scanOneByOne == "no" && x.qrCode == val)
              listNoScan1by.forEach(x => {
                noScan1by1 += x?.quantity
                scannedCounterNo1by1 += x?.loadScanningCounter
              })
              
              this.totalBoxesScanned = scannedCounterNo1by1
              this.totalLimitOfBoxes = noScan1by1
              // let totalQuantity = document.getElementById('total-quantity')
              // totalQuantity.innerHTML = this.totalLimitOfBoxes - this.totalBoxesScanned
              
                this.isOpen = true
            
              this.infoForScan = {
                orderId: order._id,
                boxId: productInfo?._id,
                loadScanningCounter: productInfo?.loadScanningCounter,
                productId: productInfo?.product,
                productQrCode: productInfo?.qrCode,
                quantity: productInfo?.quantity,
                scanOneByOne: false,
                orderNum: order?.order_num,
              }
            }
            else {
              await this.setMessageConfirmation(order?._id, productInfo?._id,  productInfo?.loadScanningCounter, productInfo?.product, productInfo?.qrCode, productInfo?.quantity, true, order?.order_num)
            }
          }
        }else{
          if(this.secondStructureLoad.some(x => x.qrCode == val)){
            this.messageReject = 'Ya estan escaneados todos los productos con este qrcode'
            this.statusOrders = 'reject'
            Vibration.vibrate(1000);
            setTimeout(() => {
                this.statusOrders = 'start'
                this.scanOrder()
            }, 1000)
          }else{
            this.messageReject = 'Error, producto no reconocido'
            this.statusOrders = 'reject'
              Vibration.vibrate(1000);
              setTimeout(() => {
                  this.statusOrders = 'start'
                  this.scanOrder()
              }, 1000)
          }

        }    

    },
    async setMessageConfirmation(orderId, boxId, loadCounter, productId, qrCode, quantity, scanOneByOne, orderNum, quantityForScan){

      let index_first = this.firstStructureLoad.findIndex(x => x.qrCode === qrCode && x.order_num == orderNum &&  !x?.completedScanned)
      let index_second = this.secondStructureLoad.findIndex(x => x.qrCode == qrCode)

        if(scanOneByOne){
          this.firstStructureLoad[index_first].loadScanningCounter += 1
          this.secondStructureLoad[index_second].loadScanningCounter += 1
          await this.$services.loadsScanServices.scanProduct(orderId, boxId, this.firstStructureLoad[index_first]?.loadScanningCounter, productId, qrCode)
  
        }else{
          let productMissing = this.firstStructureLoad[index_first]?.quantity - this.firstStructureLoad[index_first]?.loadScanningCounter
          if(quantityForScan > productMissing){
            let LoadDistribute = quantityForScan - productMissing

            this.secondStructureLoad[index_second].loadScanningCounter += productMissing
            this.firstStructureLoad[index_first].loadScanningCounter += productMissing

            await this.$services.loadsScanServices.scanProduct(orderId, boxId, this.firstStructureLoad[index_first].loadScanningCounter, productId, qrCode)
            await this.distributeProductScan(LoadDistribute, qrCode , orderNum)
          }
          else{
              this.firstStructureLoad[index_first].loadScanningCounter += quantityForScan
              this.secondStructureLoad[index_second].loadScanningCounter += quantityForScan
              await this.$services.loadsScanServices.scanProduct(orderId, boxId, this.firstStructureLoad[index_first].loadScanningCounter, productId, qrCode)

          }     
  
        }
        this.quantityForScan = null
        let data = {firstStructure: this.firstStructureLoad, secondStructure: this.secondStructureLoad, name:this.load.loadMapId }
        await this.$store.dispatch("changeLoadScannedInStore", data)
        this.verifiedLoad()
     
    },
    async scanOrder() {
      this.totalBoxesScanned = 0
      this.totalLimitOfBoxes = 0
      this.quantityForScan = null
      this.isOpen = false
      this.statusOrders = 'start';
      if (await this.checkPermission()) {
        BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
        if (result.hasContent) {
          BarcodeScanner.hideBackground();
          this.uploadProducts(result.content)
        } else {
          this.statusOrders = 'start';
        }
      }
    },

    async sendQuantityForScan(){
      this.isOpen = false
      let {orderId, boxId, loadScanningCounter, productId, productQrCode, quantity, scanOneByOne, orderNum} = this.infoForScan

      await this.setMessageConfirmation(orderId, boxId, loadScanningCounter, productId, productQrCode, quantity, scanOneByOne, orderNum, this.quantityForScan)
      this.quantityForScan = null
    },
    

    async distributeProductScan(LoadDistribute, qrCode, orderNum) {
      var orderForScan = this.firstStructureLoad.find(
        (x) =>
          x.qrCode == qrCode &&
          x.loadScanningCounter < x.quantity &&
          !x.completedScanned
      );
      if (orderForScan) {
        let index_first = this.firstStructureLoad.findIndex(x => x.qrCode === qrCode && x.loadScanningCounter < x.quantity &&  !x.completedScanned)
        let index_second = this.secondStructureLoad.findIndex(
          (x) => x.qrCode == orderForScan.qrCode
        );

        let order = this.load.Orders.filter(
          (order) => order._id == orderForScan._id
        );
        order = order.find((x) => x);
        let productInfo = order.products.find(
          (p) => p.qrCode == qrCode && orderForScan.quantity == p.quantity
        );

        let productMissing = this.firstStructureLoad[index_first]?.quantity - this.firstStructureLoad[index_first]?.loadScanningCounter

          if(LoadDistribute > productMissing){
            let loadCounter = LoadDistribute - productMissing

            this.secondStructureLoad[index_second].loadScanningCounter += productMissing
            this.firstStructureLoad[index_first].loadScanningCounter += productMissing

              await this.$services.loadsScanServices.scanProduct(
              order._id,
              productInfo._id,
              this.firstStructureLoad[index_first].loadScanningCounter,
              productInfo.product,
              qrCode
            );

            if(loadCounter > 0){
              this.distributeProductScan(loadCounter, qrCode, orderNum)
            }
          }
          else{
              this.firstStructureLoad[index_first].loadScanningCounter += LoadDistribute
              this.secondStructureLoad[index_second].loadScanningCounter += LoadDistribute
              await this.$services.loadsScanServices.scanProduct(order._id, productInfo?._id, this.firstStructureLoad[index_first].loadScanningCounter, productInfo?.product, qrCode)
          }     

      }
    },
   
    
     
    async stopScan() {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    },
    async checkPermission() {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        this.status = true;
        return true
      }
      this.status = false;
      return true
    },
    changeRoute(val){
      this.$router.push({ name: val }).catch(() => {});
    },
    
    async verifiedLoad(){   
        this.checkOrder = true
        setTimeout(async () => {
          this.checkOrder = false
          
          if(this.firstStructureLoad.every(x => x.completedScanned)){
            this.statusOrders = "approved"  
            localStorage.removeItem('LoadScanned')
            let quantityTotal = 0
            this.load.Orders.forEach(x => quantityTotal += x.no_of_boxes)
            let load = await this.$services.loadsServices.getLoadDetails(this.load.loadMapId); 
            let allProductScanned = []
            load.Orders.forEach(x => {
              allProductScanned.push(x.products.every(prod => prod.loadScanningCounter >= prod.quantity))
            })
            this.stopScan()
            this.$store.commit("setOrderDetails", [] );

            if(allProductScanned.every(x => x == true)){
              localStorage.removeItem(`allProducts${this.load.loadMapId}`)
              await this.$services.loadsScanServices.completeLoad(this.load.loadMapId, quantityTotal )
              localStorage.removeItem(JSON.stringify(this.load.loadMapId))
              this.$router.push({ name: "load-status" }).catch(() => {});
            }else{
              this.$router.push({name: 'orders'})
            }
          }
          else this.scanOrder()
        }, 1000)
    },
    shipperName(val){
      var shipper = val?.shipper?.find(x => x)
      return shipper?.name
    },
    

    async updateData(orderId, boxId, productId, qrCode, quantity, scanOneByOne){
      if(this.$route.name == 'scan-order'){

      let load = await this.$services.loadsServices.getLoadDetails(this.load.loadMapId); 
      if(load.loadingStatus.text == 'Dispatched'){
        this.firstStructureLoad.forEach(x => {
          x.loadScanningCounter = x.quantity
        })
        this.verifiedLoad()

      }else{
        let info = null
        for (let i = 0; i < load.Orders.length; i++) {
          const order = load.Orders[i];
          if(this.firstStructureLoad.some(x => x.order_num == order.order_num)){
            let structure = await this.setStructure(order)
            for (let cont = 0; cont < structure.firstStructure.length; cont++) {
              const product = structure.firstStructure[cont];
              this.firstStructureLoad.forEach(x => {
                if(x.qrCode == product.qrCode && x?.quantity === product?.quantity){
                  if(product.loadScanningCounter != x.loadScanningCounter ) {
                    x.loadScanningCounter = product.loadScanningCounter
                  }
                  if(product.qrCode == qrCode && product.quantity == quantity && product.boxId == boxId){
                    info = {
                      orderId,
                      boxId,
                      loadScanningCounter: product.loadScanningCounter,
                      productId, 
                      qrCode, 
                      quantity, 
                      scanOneByOne
                    }
                  }
                }
              })
            }
           
            for(let cont = 0; cont < structure.secondStructure.length; cont++){
              const product = structure.secondStructure[cont];
              this.secondStructureLoad.forEach(x => {
                if(x.qrCode == product.qrCode){
                  x.loadScanningCounter = product.loadScanningCounter
                }
              })
            }

          }
        }
        if(!info){
          return false
        }
        return info
      }
      }
    },
     askQuantity(){
      return this.totalLimitOfBoxes - this.totalBoxesScanned
    },
  },
};
</script>

<style scoped>
p{
  margin: 2px 0px !important
}
.scan-confirmation {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.8);

  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.container {
  display: flex;
  flex-direction: column;
}
.cont {
  box-shadow: 0px 0px 7px !important;
  width: 100%;
  height: 17vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff !important;
}

.waitScan {
  width: 10%;
}
.check {
  color: green;
  font-size: 30px;

}
.ban {
  color: #be1515;
  font-size: 50px;

}

@-webkit-keyframes onError {
  0% {
    -webkit-box-shadow: 0 0 1px red !important;
  }
  50% {
    -webkit-box-shadow: 0 0 8px red !important;
  }
  100% {
    -webkit-box-shadow: 0 0 2px red !important;
  }
}

.allScreen {
  display: flex;
  flex-direction: column-reverse;
  height: 85vh;
  overflow: scroll;
  align-items: center;
}

.statusCheck{
  background: rgb(255, 255, 255) !important;
  box-shadow: 0px 0px 7px green !important;
  color: #fff !important;
}
.orden-img{
  width: 70%;
}
.box-orden{
  list-style: none;
  display: flex;
  padding: 0px;
  width: 100%;
  flex-wrap: wrap;
  padding: 0px 20px;
  margin-bottom: 10px !important
}
.box-orden li{
    width: 25px;
    border: 1px solid #a2a2a2;
    margin: 1px
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
}
.info-header {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.status {
  color: green;
  font-weight: 500;
  font-size: 12px;
}
.icon-load {
  width: 35%;
  margin-right: 20px;
}


/* Here... */
.check-all-Screen {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    border: solid 17px green;
    width: 109px;
    height: 59px;
    border-top: none;
    border-right: none;
    transform: rotate(-45deg);
    transform-origin: top left;
    box-shadow: -5px 5px 0 0 rgb(3 148 10 / 14%);
    
}

.animationCheck {
  animation: start 1s ease infinite both;
  animation-play-state: running!important;
}

@keyframes start {
  0% {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  50% {
    opacity: 1;
    width: 0;
    height: 59px;
  }
  100% {
    width: 120px;
  }
}
.checkScreen{
  background: rgba(11, 134, 0, 0.1)
}
.banScreen{
   background: rgba(255, 138, 138, 0.1) !important;
}
.finishCheck{
  background: #fff;
  flex-direction: column-reverse
}
.article{
 text-align: initial;
 display: flex;
 justify-content: space-between;
 align-items: flex-start;
 padding: 12px;
 font-weight: 500;
 width: 100%;
 background: #fefffe;
 color: rgb(0, 0, 0);
 box-shadow: 0px 1.2px 1px #ccc;
 border-radius: 5px;
border: 1px solid #efefef;
}
.uk-card-body::before{
  content: none;
}
.completedOrden{
  background: green;
}
.inProgressOrden{
  background: #fff500
}
.icon-checked{
  width: 20px;
}
.completed-card{
  height: 43px;
  border-left: 1px solid #ccc;
  padding-left: 20px;
  align-items: center;
}
.result-scan{
  width: 100%;
  height: 68vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.statusError{
  background: #ff01011c;
    justify-content: center;
}



.modal {
  width: 500px;
  margin: 0px auto;
  padding: 20px;
  margin: 0px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 3px;
  transition: all 0.2s ease-in;
  font-family: Helvetica, Arial, sans-serif;
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
.webView{
  height: 30vh !important;
}
.uk-input{
  border: 0.7px solid #666;
  min-width: 175px;
}
.title-action{
  font-size: 14px;
  font-weight: 500;
}

</style>
