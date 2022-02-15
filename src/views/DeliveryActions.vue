<template>
<ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeout"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>
  <div class="container uk-flex uk-flex-column uk-flex-between" :class="{backg: resultScan}">
    <button @click="uploadProducts('1b')">Escanear</button>
    <div class="stiky">
      <p style="font-size: 13px !important; font-weight: 500">
        {{ load?.loadNumber }}
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
        style="align-items: center"
      >
        <div class="uk-flex uk-flex-wrap">
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Shipper: </span
            ><span>&nbsp; {{ shipperName(load) }}</span>
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span
            ><span>&nbsp; {{ load?.firstOrdenInfo?.sector }}</span>
          </p>
        </div>
      </div>
    </div>
     <div 
      class="result-info"
      >
      <div
        v-if="!showProduct"
        class="status-order"
        :class="{ statusError: statusOrders == 'reject', statusCheck: statusOrders == 'approved' }"
      >
        <div v-if="statusOrders == 'approved'" style="width: 100%; font-size: 30px">
          <h6 style="font-size: 14px" class="uk-margin-remove">{{completedOrder}}</h6>
        </div>
        <div v-if="statusOrders == 'reject'" style="width: 100%;; font-size: 30px">
            <h6 class="uk-margin-remove">{{messageReject}} <font-awesome-icon icon="ban" style="color: #be1515;"/>
            </h6>
        </div>
      </div>
      <ul
        v-if="showProduct"
        class="uk-list uk-list-divider"
        style="list-style: none"
      >
      <div
        v-for="order in orders"
        :key="order"
        class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        :class="{ ordenCompleted: order.completed }"
      >
        <div class="uk-text-left info-user uk-flex uk-flex-wrap">
          <div class="btn uk-flex">
            <div class="uk-flex uk-flex-column uk-text-left">
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
            <span> <font-awesome-icon icon="map-marker-alt" /> {{ order.address}}</span>
          </p>
        </div>
        <div class="uk-width-1-2">
              <div
                @click="setMap(order)"
                class="uk-flex-column"
                style="align-items: center; display: inline-flex"
              >
                <img src="../assets/map.png" class="img-scan" alt="" />
                <span>Ver Ruta</span>
              </div>
            </div>
      </div>
       <div v-if="imagiElement.length > 0" class="uk-card uk-card-default uk-card-body uk-width-1 img-card">
      <div class="uk-flex  img-scroll">
             <span v-for="(src, index) in imagiElement"  :key="src" style="position: relative; width: 85px; display: flex; margin: 0px 10px">
              <img class="img-result" :src="src"  alt="Red dot" />
               <img src="../assets/rejected.png" class="icon-close" @click="deleteImage(index)" alt="">
             </span>
          </div>
    </div>
      </ul>
    </div>
    <div style="height: 300px">
      <div class="action">
    <ul v-if="!showProduct" class="box-orden">
            <li v-for="product in firstStructureLoad" :key="product" 
                :class="{completedOrden: product.completedScanned, inProgressOrden: product.scanProgress}" style="">&nbsp;</li> 
          </ul>
      <div
        class="cont uk-card uk-card-default uk-card-hover uk-card-body"
      >
        <strong class="exception uk-padding-small">
          Hubo Alguna Excepción? No
          <div class="onoffswitch">
            <input
              type="checkbox"
              v-model="exception"
              name="onoffswitch"
              class="onoffswitch-checkbox"
              id="myonoffswitch"
              tabindex="0"
            />
            <label class="onoffswitch-label" for="myonoffswitch"></label>
          </div>
          Si
        </strong>
        <timeline
          :step="step"
          :exception="exception"
          :resultScan="resultScan"
          :imagiElement="imagiElement"
          @action="getShow($event)"
          @resetSign="resetSign()"
        />
      </div>
      </div>
    </div>
    <div id="deliver-quantity" class="uk-flex-top" uk-modal>
        <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

            <button class="uk-modal-close-default" @click="scanOrder()" type="button" uk-close></button>

            <p style="font-size: 15px;">Cantidad (hasta el máximo de <span>{{totalLimitOfBoxes.totalOfOrders - totalLimitOfBoxes.scanned }})</span></p>
            <input type="number" v-model="quantityForScan" :max="totalLimitOfBoxes.totalOfOrders" class="uk-input" >
            <p class="uk-text-right uk-flex uk-flex-around" style="margin-top: 20px !important;">
                <button class="uk-button uk-button-default uk-modal-close" style="margin: 0px 10px" @click="scanOrder()" type="button">Cancelar</button>
                <button class="uk-button uk-button-primary uk-modal-close" @click="sendQuantityForScan()" type="button">Guardar</button>
            </p>
        </div>
    </div> 

    
  </div>
</template>

<script>
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { mapGetters } from "vuex";
import { Vibration } from "@ionic-native/vibration";
import timeline from "../components/timeline.vue";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Geolocation } from '@capacitor/geolocation'
import { Mixins} from '../mixins/mixins'
import UIkit from "uikit";
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";


export default {
  name: "DeliveryActions",
  alias: "Entrega de Ordenes",
  components: {
    timeline,
    IonLoading
  },
  mixins: [Mixins],
  data() {
    return {
      show: null,
      orders: null,
      resultScan: false,
      cont: 0,
      load: null,
      imagiElement: [],
      step: 0,
      allProductScanned: false,
      exception: false,
      firm: null,
      location: {
        latitude: null, 
        longitude: null
      },
      statusOrders: 'start',
      firstStructureLoad: [],
      secondStructureLoad: [],
      quantityForScan: null,
      totalLimitOfBoxes: {
        scanned: null,
        totalOfOrders: null
      },
      checkOrder: true,
      messageReject: null,
      showProduct: true,
      timeout: 10000
    };
  },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  computed: {
    ...mapGetters([
      "orderScan",
      "loadStore",
      "exceptionStore",
      "causeExceptionsStore",
      "digitalFirmStore",
      "settings",
      "structureToScan"
    ]),

    completedOrder: function(){
      if(this.firstStructureLoad.every(x => x.completedScanned)){
        return 'TODAS LAS ORDENES HAN SIDO CARGADAS'
      }
      else{
        return 'LA ORDEN HA SIDO CARGADA'
      }
    },
  },
  async mounted() {
    this.load = {...this.loadStore};
    this.orders = this.orderScan
    this.firstStructureLoad = this.structureToScan.firstStructure
    this.secondStructureLoad = this.structureToScan.secondStructure
    this.orders.map(x => {
       if (x.totalOrdersScanned) {
          this.step = 1
        }
      x.completedScanned = false
    })
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


    await this.getLocation()
    this.firstStructureLoad = firstStructure
    this.secondStructureLoad = secondStructure

    setInterval(async () =>{
      await this.updateData()
    }, 10000)
    
    if(this.secondStructureLoad.every(x => x.completedScanned)){
      this.allProductScanned = true
      this.verifiedLoad()
    }

    console.log(this.firstStructureLoad, this.secondStructureLoad)

  },
  watch: {
    digitalFirmStore: {
      handler: async function (newVal) {
        if (newVal !== null) {
          this.firm = newVal;
          this.setOpen(true)
          await this.postImages()
          console.log(this.firstStructureLoad)
          let load = await this.$services.loadsServices.getLoadDetails(this.load.loadMapId);
          let orders ;
          if(load){
            orders = load.Orders
          }else{
            orders = await JSON.parse(localStorage.getItem(`allProducts${this.load.loadMapId}`))
          }
          let res = []
          
          for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            res.push(order.products.every(x => x.loadScanningCounter >= x.quantity))
          }
          console.log(res)
          if(res.every(x => x == true)){
            await this.changeRouteLoads('Delivered', this.load)
            localStorage.setItem(`sendInfo${this.load.loadMapId}`, true)
          }
          setTimeout(() =>{
            this.$router.push({ name: "home" }).catch(() => {});
            this.setOpen(false)
          }, 8000)

        }
      },
    },
     $route: function(newVal){
      if (newVal){
        this.stopScan()
      }
    },
    
    quantityForScan: function(newVal){
      if(newVal > this.totalLimitOfBoxes.totalOfOrders){
        this.quantityForScan = this.totalLimitOfBoxes.totalOfOrders
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
            if(!this.allProductScanned)
            this.allProductUpload()
            else this.verifiedLoad()

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
    },
    exception:{
      handler: function (newVal) {
        if (newVal) {
          this.step = 1
        } else if (newVal === false && this.orders.some(x => {return x.products.some(z => z.loadScanningCounter !== 0)}) === false) {
          this.step = 0
        }
      }, deep: true
    },
  },

  methods: {
    getShow(value) {
      this.show = value;
      if (value === "scan") {
        this.resultScan = false
        this.scanOrder();   
      } else if (value === "camera" && this.imagiElement?.length <= 6) {
        this.getCam();
      } else if (value === "Singnature") {
        this.step++;
      } else if (value === "exception") {
        this.step = 2;
      }
    },
   
    async getCam() {
      this.getCheckPermissions();
      const ele = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        limit: 3,
        resultType: CameraResultType.Base64,
      });
      const image = `data:image/${ele.format};base64, ${ele.base64String}`;
      this.imagiElement.push(image);
      console.log(this.imagiElement)
       if (this.imagiElement.length >= 1 && this.imagiElement.length <= 20) {
        this.step = 2;
      }
      this.cont = this.cont + 1;
    },

    async getPickImages() {
      let imagi = [];
      imagi.push(
        await Camera.pickImages({
          quality: 90,
          allowEditing: true,
          correctOrientation: true,
          width: "25%",
          limit: null,
          resultType: CameraResultType.Uri,
        })
      );
    },

    async getCheckPermissions() {
      const permissions = Camera.checkPermissions(['prompt' | 'prompt-with-rationale' | 'granted' | 'denied']);
      console.log(permissions);
      this.getRequestPermissions();
    },

    async getRequestPermissions() {
      try {
        const permissions1 = Camera.requestPermissions({
          permissions: ["camera" | "photos"],
        });
        console.log(permissions1);
      } catch (error) {
        console.log(error);
      }
    },
  
    shipperName(val){
      var shipper = val?.shipper?.find(x => x.name)
      return shipper?.name
    },

     async postImages() {
        let unreturnedOrders = this.orders.filter((x) => !x.isReturn);
      for (var it = 0; it < unreturnedOrders.length; it++) {
        let order = unreturnedOrders[it];
        let images = [];
        images.push(...this.imagiElement);
        let numberOfImages = 3;
        if (this.imagiElement.length === 1) {
          numberOfImages = 1;
        } else if (this.imagiElement.length === 2) {
          numberOfImages = 2;
        }
        for (let i = numberOfImages; i < 3; i++) {
          images.push(this.imagiElement[0]);
        }
        images.push(this.firm);
          this.$services.deliverServices.postImages(images, this.location.latitude, this.location.longitude, order._id);
      }
        let resultId = []
        this.firstStructureLoad.forEach(x => {
          if(x.loadScanningCounter < x.quantity){
            resultId.push(x._id)
          }
        })
        console.log(resultId, 'exception')
      // if (this.causeExceptionsStore && loadScanningCounter < quantity) {
       

      //   console.log(quantity, 'quantity')
      //   console.log(loadScanningCounter, 'loadScanningCounter')
      //   console.log(unreturnedOrders, 'unreturnedOrders')
      //   console.log(unreturnedOrders[0]._id, 'unreturnedOrders')
      //   console.log(this.causeExceptionsStore, 'this.causeExceptionsStore')

        // await this.$services.exceptionServices.setExceptions(unreturnedOrders[0]._id, this.causeExceptionsStore);
        
      // } else {
        
      //   console.log(quantity, 'quantity else')
      //   console.log(loadScanningCounter, 'loadScanningCounter else')
      // }
    },


     async uploadProducts(val){
        let orderForScan = this.firstStructureLoad.find(
          x => x.qrCode == val &&
          x.loadScanningCounter < x.quantity &&
          !x.completedScanned
        )
        if(orderForScan){
          let detailsOrderToScan = this.secondStructureLoad.find(x => x.qrCode == orderForScan.qrCode)
          if(detailsOrderToScan.loadScanningCounter >= detailsOrderToScan.totalOfOrders ){
              Vibration.vibrate(1000);
              this.statusOrders = 'reject'
              this.showProduct = false
              this.messageReject = 'Ya estan escaneadas todas las ordenes con este qrcode'
              setTimeout(() => {
                  this.showProduct = true
                  this.statusOrders = 'start'
                  this.scanOrder()
              }, 10000)
          }
          else{
            let order =  await this.$services.loadsScanServices.getProduct(orderForScan._id);
            order = order.find(x => x)
            let productInfo = order.products.find(p => p?.qrCode == val && orderForScan.order_num == order.order_num)
            console.log(productInfo)
            if(productInfo?.scanOneByOne === "no") {
              let noScan1by1 = 0
              let listNoScan1by = this.firstStructureLoad.filter(x => x.scanOneByOne == "no" && x.qrCode == val)
              listNoScan1by.forEach(x => {
                noScan1by1 += x.quantity
              })
              this.totalLimitOfBoxes.scanned = detailsOrderToScan.loadScanningCounter
              this.totalLimitOfBoxes.totalOfOrders = noScan1by1
              UIkit.modal('#deliver-quantity').show()
              this.infoForScan = {
                orderId: order._id,
                boxId: productInfo._id,
                loadScanningCounter: productInfo.loadScanningCounter,
                productId: productInfo.product._id,
                productQrCode: productInfo.qrCode,
                quantity: productInfo.quantity,
                scanOneByOne: false
                }
            }
            else {
              await this.setMessageConfirmation(order._id, productInfo._id,  productInfo.loadScanningCounter, productInfo.product._id, productInfo.qrCode, productInfo.quantity, true)
            }
          }
        }else{
          if(this.secondStructureLoad.some(x => x.qrCode == val)){
            Vibration.vibrate(1000);
            this.messageReject = 'Ya estan escaneadas todas las ordenes con este qrcode'
            this.showProduct = false
            this.statusOrders = 'reject'

            setTimeout(() => {
                this.showProduct = true
                this.statusOrders = 'start'
                this.scanOrder()
            }, 10000)
          }else{
            this.statusOrders = 'reject';
            this.messageReject = 'Error, producto no reconocido'
            this.resultScan = false
            this.showProduct = false

            Vibration.vibrate(1000);
            setTimeout(() => {
                this.statusOrders = 'start'
                this.showProduct = true
                this.resultScan = true
                this.scanOrder()
            }, 10000)
          }
        }      
    },
     async setMessageConfirmation(orderId, boxId, loadCounter, productId, qrCode, quantity, scanOneByOne){
      let index_first = this.firstStructureLoad.findIndex(x => x.qrCode === qrCode && x.quantity == quantity &&  !x.completedScanned)
      let index_second = this.secondStructureLoad.findIndex(x => x.qrCode == qrCode)

      if(scanOneByOne){
        this.firstStructureLoad[index_first].loadScanningCounter += 1
        this.secondStructureLoad[index_second].loadScanningCounter += 1
        this.$services.deliverServices.deliverProduct(orderId, boxId, this.secondStructureLoad[index_second].loadScanningCounter, productId, qrCode)

      }else{
        if(loadCounter > this.firstStructureLoad[index_first].quantity){
              let LoadDistribute = loadCounter - this.firstStructureLoad[index_first].quantity
              let secondLoadDistribute = loadCounter - LoadDistribute

              this.secondStructureLoad[index_second].loadScanningCounter += secondLoadDistribute
              this.firstStructureLoad[index_first].loadScanningCounter += secondLoadDistribute

              await this.$services.deliverServices.deliverProduct(orderId, boxId, secondLoadDistribute, productId, qrCode)
              await this.distributeProductScan(LoadDistribute,qrCode )
        }
        else{

            this.firstStructureLoad[index_first].loadScanningCounter += loadCounter
            await this.$services.deliverServices.deliverProduct(orderId, boxId, this.firstStructureLoad[index_first].loadScanningCounter, productId, qrCode)

            this.secondStructureLoad[index_second].loadScanningCounter += loadCounter
            }     

      }
      let data = {firstStructure: this.firstStructureLoad, secondStructure: this.secondStructureLoad, name:this.load.loadMapId }
      await this.$store.dispatch("changeLoadScannedInStore", data)

      this.verifiedLoad()
    },
    async scanOrder() {
      this.statusOrders = 'start';
      if (await this.checkPermission()) {
        this.showProduct = false
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
      let {orderId, boxId, loadScanningCounter, productId, productQrCode, quantity, scanOneByOne} = this.infoForScan
      loadScanningCounter = this.quantityForScan
      await this.setMessageConfirmation(orderId, boxId, loadScanningCounter, productId, productQrCode, quantity, scanOneByOne)
      this.quantityForScan = null
    },

    async distributeProductScan( LoadDistribute, qrCode){
      var orderForScan = this.firstStructureLoad.find(
          x => x.qrCode == qrCode &&
          x.loadScanningCounter < x.quantity &&
          !x.completedScanned
      )
        if(orderForScan){
          let index_first = this.firstStructureLoad.findIndex(x => x.qrCode === orderForScan.qrCode && x.loadScanningCounter < x.quantity)
          let index_second = this.secondStructureLoad.findIndex(x => x.qrCode == orderForScan.qrCode)
          
            let order =  await this.$services.loadsScanServices.getProduct(orderForScan._id);
            order = order.find(x => x)
            let productInfo = order.products.find(p => p.qrCode == qrCode && orderForScan.quantity == p.quantity)
            this.secondStructureLoad[index_second].loadScanningCounter += LoadDistribute
            this.firstStructureLoad[index_first].loadScanningCounter += LoadDistribute

            await this.$services.deliverServices.deliverProduct(order._id, productInfo._id, LoadDistribute, productInfo.product._id, qrCode)
            
        }
    },
    async getLocation () {
        try {
          const geo = await Geolocation.getCurrentPosition();
          this.location.latitude = geo.coords.latitude;
          this.location.longitude = geo.coords.longitude;
        } catch (e) {
          if (e.code === 1 || e.message === "location disabled") {
            alert("Debe activar la localización.");
          } else {
            alert("Error inesperado. Favor contactese con el Administrador.");
          }
          console.log(e);
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
      this.allProductScanned = true
        this.checkOrder = true
        this.statusOrders = "approved" 
        this.showProduct = false
        setTimeout(async () => {
          this.statusOrders = 'start'
          this.showProduct = true

          this.checkOrder = false
          if(this.firstStructureLoad.every(x => x.completedScanned)){
            console.log(this.firstStructureLoad)
          this.resultScan = true
            this.step = 1
            localStorage.removeItem('LoadScanned')
            let quantityTotal = 0
            this.load.Orders.forEach(x => quantityTotal += x.no_of_boxes)
          }
          else this.scanOrder()
        }, 1000)
    },
    deleteImage(i){
      this.imagiElement.splice(i, 1)
    },
    allProductUpload(){
      this.statusOrders = 'start'
      this.resultScan = true
      this.step = 1
    },
    async updateData(){
      if(this.$route.name == 'deliveryActions'){

      let load = await this.$services.loadsServices.getLoadDetails(this.load.loadMapId); 
      if(load.loadingStatus.text == 'Delivered'){
        this.firstStructureLoad.forEach(x => {
          x.loadScanningCounter = x.quantity
        })
        this.verifiedLoad()
      }else{
        for (let i = 0; i < load.Orders.length; i++) {
          const order = load.Orders[i];
          
          if(this.firstStructureLoad.some(x => x.order_num == order.order_num)){
            let structure = await this.setStructure(order)
         
            for(let cont = 0; cont < structure.secondStructure.length; cont++){
              const product = structure.secondStructure[cont];
              this.secondStructureLoad.forEach(x => {
                if(x.qrCode == product.qrCode){
                  x.loadScanningCounter = product.loadScanningCounter
                  x.completedScanned = x.loadScanningCounter >= x.quantity
                  x.scanProgress =  x.loadScanningCounter > 0 && !x.completedScanned
                }
              })
            }
          }
        }
      }
      }
    },
    resetSign(){
      this.step = 2
    }
  },
};
</script>

<style scoped>
.qr {
  width: 60%;
}
.circle {
  background-color: rgb(25, 189, 33);
}
.uk-card-body{
  padding: 16px 15px;
}
.onoffswitch {
  position: relative;
  width: 73px;
  display: inline-block;
  width: 45px;
  margin: 0px 5px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
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
.exception {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}
.container {
  display: flex;
  flex-direction: column;
}
.backg {
    background-color: rgb(255, 255, 255);

}
.result-info {
  overflow: scroll;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.statusError{
  background: #ff01011c;
    justify-content: center;
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
.info-header {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.icon-load {
  width: 40%;
  margin-right: 20px;
}
.article {
  text-align: initial;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  width: 100%;
  background: #fefffe;
  color: rgb(0, 0, 0);
  box-shadow: 0px 1.2px 1px #ccc;
  border-radius: 10px;
  border: 1px solid #efefef;
  margin: 10px 0px;
  z-index: 3;
}
li::before {
  content: none;
}
.statusCheck{
  background: rgb(255, 255, 255) !important;
  box-shadow: 0px 0px 7px green !important;
  color: #fff !important;
}
.img-result {
  width: 98%;
  height: 80px;
  border: 1px solid #000;
}
.icon-close{
  background-color: #f04c3b40;;
  position: absolute;
  right: -10px;
  top: -10px;
  width: 22px;
  border-radius: 10px;

  margin: 2px 0px 0px -23px;
}
.ban {
  color: #be1515;
  font-size: 50px;

}
.btn {
  display: flex;
  align-items: baseline;
  width: 100%;
}
p{
  margin: 2px 0px !important;
}
.img-scan {
  width: 39px;
}
.box-orden{
  list-style: none;
  display: flex;
  padding: 0px;
  width: 100%;
  flex-wrap: wrap;
  padding: 0px 20px;
  margin: 5px 0px;
}
.box-orden li{
    width: 25px;
    border: 1px solid #a2a2a2;
    margin: 1px
}
.status-order{
  width: 100%;
  height: 52%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.check-all-Screen {
  position: fixed;
    left: calc(70% - 30px);
    top: calc(54% + 30px);
    border: solid 17px green;
    width: 109px;
    height: 59px;
    margin: -50px 0 0 -100px;
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
.completedOrden{
  background: green;
}
.inProgressOrden{
  background: #fff500
}
.cont{
  z-index: 0;
  padding: 15px 5px !important;
}
.action{
  position: absolute;
  bottom: 0px;
}
</style>
