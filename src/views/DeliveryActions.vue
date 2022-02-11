<template>
  <div class="container uk-flex uk-flex-column uk-flex-between" :class="{backg: resultScan}">
    <button @click="uploadProducts('7')">escanear</button>
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
    <div class="result-info"
    :class="{ statusError: statusOrders == 'reject', statusCheck: statusOrders == 'approve' }"
    >
    <div></div>
      <div v-if="statusOrders == 'reject'">
          <font-awesome-icon icon="ban" class="ban" />
          <h6>ORDEN NO RECONOCIDA</h6>
      </div>
      <ul
        v-if="resultScan"
        class="uk-list uk-list-divider"
        style="list-style: none"
      >
        <li
          v-for="orden in orders"
          :key="orden"
          class="article uk-card uk-card-default uk-card-body"
        >
          <div>
            <p class="uk-width-1-1" style="font-weight: 600">
              <font-awesome-icon
                icon="map-marker-alt"
                style="font-size: 14px; color: green"
              />&nbsp;<strong>{{ orden.zone.name }}</strong>
            </p>
            <strong>No. de Orden: &nbsp; {{ orden.order_num }}</strong>
          </div>
          <div class="uk-flex uk-flex-column" style="align-items: center">
            <font-awesome-icon
              icon="check-circle"
              style="font-size: 20px; color: green"
            />
            <span class="font-weight-medium" style="color: green">Entregada</span>
          </div>

          <div v-if="imagiElement.length" class="uk-flex uk-width-1-1" style="margin-top: 10px" >
              <img class="img-result" v-for="src in imagiElement" :key="src" :src="src" alt="Red dot" />
              <img class="img-result" :src="firm" alt="Fima Digital" />
          </div>
        </li>
      </ul>
      
    </div>
    <div
      class="cont uk-card uk-card-default uk-card-hover uk-card-body"
      style="z-index: 0; padding: 15px 0px  !important;"
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
      />
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
import UIkit from "uikit";

export default {
  name: "DeliveryActions",
  alias: "Entrega de Ordenes",
  components: {
    timeline,
  },
  data() {
    return {
      show: null,
      orders: null,
      resultScan: false,
      cont: 0,
      load: null,
      imagiElement: [],
      step: 0,
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
    };
  },
  computed: {
    ...mapGetters([
      "orderScan",
      "loadStore",
      "exceptionStore",
      "digitalFirmStore",
      "settings",
      "structureToScan"
    ]),
  },
  async mounted() {
    this.load = {...this.loadStore};
    this.orders = this.orderScan
    console.log(this.orderScan)
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

    this.getShow("scan");
    await this.getLocation()
    this.firstStructureLoad = firstStructure
    this.secondStructureLoad = secondStructure
    console.log(this.firstStructureLoad)

    setInterval(async () =>{
      await this.updateData()
    }, 10000)
    
    if(this.secondStructureLoad.every(x => x.completedScanned)){
      this.verifiedLoad()
    }else{
      this.scanOrder()
    }
  },
  watch: {
    digitalFirmStore: {
      handler: async function (newVal) {
        if (newVal !== null) {
          this.firm = newVal;
         await this.postImages()
          this.$router.push({ name: "home" }).catch(() => {});

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

  methods: {
    getShow(value) {
      this.show = value;
      if (value === "scan") {
        this.scanOrder();   
      } else if (value === "camera" && this.imagiElement?.length <= 6) {
        this.getCam();
      } else if (value === "firm") {
        this.serieA = value;
        this.step++;
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
    },


     async uploadProducts(val){
      //   Compruebo si se encuentra el qrCode en la fila de la primera estructura
        let orderForScan = this.firstStructureLoad.find(
          x => x.qrCode == val &&
          x.loadScanningCounter < x.quantity &&
          !x.completedScanned
        )
        if(orderForScan){
          let detailsOrderToScan = this.secondStructureLoad.find(x => x.qrCode == orderForScan.qrCode)
          if(detailsOrderToScan.loadScanningCounter >= detailsOrderToScan.totalOfOrders ){
              Vibration.vibrate(1000);
              alert('Ya estan escaneadas todas las ordenes con este qrcode')
              setTimeout(() => {
                  this.statusOrders = 'start'
                  this.scanOrder()
              }, 1000)
          }
          else{
            let order =  this.orders?.find(x => x?._id == orderForScan?._id && x?.order_num == orderForScan?.order_num)
            let productInfo = order.products.find(p => p?.qrCode == val && orderForScan.order_num == order.order_num)
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
            alert('Ya estan escaneadas todas las ordenes con este qrcode')
            Vibration.vibrate(1000);
            setTimeout(() => {
                this.statusOrders = 'start'
                this.scanOrder()
            }, 1000)
          }else{

            this.statusOrders = 'reject';
              Vibration.vibrate(1000);
              setTimeout(() => {
                  this.statusOrders = 'start'
                  this.scanOrder()
              }, 1000)
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
        this.checkOrder = true
        setTimeout(async () => {
          this.checkOrder = false
          if(this.firstStructureLoad.every(x => x.completedScanned)){
            this.step = 1
            this.resultScan = true
            localStorage.removeItem('LoadScanned')
            let quantityTotal = 0
            this.load.Orders.forEach(x => quantityTotal += x.no_of_boxes)

            this.statusOrders = "approved"  
          }
          else this.scanOrder()
        }, 1000)
    },
    async updateData(){
      if(this.$route.name == 'scan-order'){

      let load = await this.$services.loadsServices.getLoadDetails(this.load.loadMapId); 
      if(load.loadingStatus.text == 'Dispatched'){
        this.firstStructureLoad.forEach(x => {
          x.loadScanningCounter = x.quantity
        })
        this.verifiedLoad()
      }else{
        for (let i = 0; i < load.Orders.length; i++) {
          const order = load.Orders[i];
          
          if(this.firstStructureLoad.some(x => x.order_num == order.order_num)){
            let structure = await this.setStructure(order)
            
            for (let cont = 0; cont < structure.firstStructure.length; cont++) {
              const product = structure.firstStructure[cont];
              this.firstStructureLoad.forEach(x => {
                if(x.qrCode == product.qrCode){
                  x.loadScanningCounter = product.loadScanningCounter
                  x.completedScanned = x.loadScanningCounter >= x.quantity
                  x.scanProgress =  x.loadScanningCounter > 0 && !x.completedScanned

                }
              })
            }
           
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
  padding: 0px 10px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.statusError{
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
  width: 21%;
  height: 60px;
  margin-right: 5px;
  border: 1px solid #000;
}
.ban {
  color: #be1515;
  font-size: 50px;

}

</style>
