<template>
  <div class="container uk-flex uk-flex-column uk-flex-between" :class="{backg: resultScan}">
    <button @click="uploadProducts(5)">escanear</button>
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
        Hubo Alguna Excepcion? No
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
  </div>
</template>

<script>
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { mapGetters } from "vuex";
import { Vibration } from "@ionic-native/vibration";
import timeline from "../components/timeline.vue";
import { Camera, CameraResultType } from "@capacitor/camera";
export default {
  name: "DeliveryActions",
  components: {
    timeline,
  },
  data() {
    return {
      show: null,
      orders: null,
      resultScan: null,
      cont: 0,
      load: null,
      imagiElement: [],
      step: 0,
      exception: false,
      firm: null,
      mira: 'null22'
    };
  },
  computed: {
    ...mapGetters([
      "orderScan",
      "loadStore",
      "exceptionStore",
      "digitalFirmStore",
      "settings"
    ]),
  },
  mounted() {
    if(this.loadStore){
       this.load = this.loadStore;
       this.orders = this.load.Orders
    }
    this.getShow("scan");
    if (this.orderScan?.length > 1) {
      this.$emit("setNameHeader", `Entrega de Ordenes`);
    } else if (this.orderScan?.length == 1) {
      this.$emit(
        "setNameHeader",
        `Orden No. ${this.orderScan[0]?.order_num}`
      );
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
    async scanOrder() {
      this.statusOrders = 'start';
        if (await this.checkPermission()) {
          BarcodeScanner.hideBackground();

          const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

          if (result.hasContent) {

            BarcodeScanner.hideBackground();
            this.uploadProducts(result.content)
            var OrderElement  = this.orders.findIndex(x => x.products.findIndex(z => z.qrcode == result.content))

            if (OrderElement > -1) {
              
              this.step++;
              this.resultScan = result
              this.verifiedElement(OrderElement)
            } else if (OrderElement){

              this.statusOrders = 'reject';
              Vibration.vibrate(1000);
              setTimeout(() => {
                this.statusOrders = 'start'
                this.scanOrder()
              }, 1000)
            }
          }
        }
    },

    async uploadProducts(val){
        let orderForScan = this.orders?.find(order => order?.products?.find(prod => prod.qrcode = val))

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
            let order =  await this.$services.loadsScanServices.getProduct(orderForScan._id);
            order = order.find(x => x)
            let productInfo = order.products.find(p => p.qrCode == val && orderForScan.quantity == p.quantity)
            // compruebo si es scan 1by1 o no
            
            if(productInfo.scanOneByOne === "no") {
              let noScan1by1 = 0
              let listNoScan1by = this.firstStructureLoad.filter(x => x.scanOneByOne == "no" && x.qrCode == val)
              listNoScan1by.forEach(x => {
                noScan1by1 += x.quantity
              })
              this.totalLimitOfBoxes.scanned = detailsOrderToScan.loadScanningCounter
              this.totalLimitOfBoxes.totalOfOrders = noScan1by1
              this.infoForScan = {
                orderId: order._id,
                boxId: productInfo._id,
                loadScanningCounter: productInfo.loadScanningCounter,
                productId: productInfo.product._id,
                productQrCode: productInfo.qrCode,
                scanOneByOne: false
                }
            }
            else {
              await this.setMessageConfirmation(order._id, productInfo._id, productInfo.loadScanningCounter, productInfo.product._id, productInfo.qrCode, productInfo.quantity, true)
            }
          }
        }else{
          if(this.secondStructureLoad.some(x => x.qrCode == val)){
            alert('No existe producto con este qrCode')
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

    async stopScan() {
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
    },
    async checkPermission() {
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (status.granted) {
        return true;
      }
      return false;
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
    verifiedElement(val){
        this.checkOrder = true
        this.orders[val].completed = true
        this.$store.commit("scanOrder", this.orders);
        setTimeout(() => {
          this.checkOrder = false
          if (this.orders.every(x => x.completed == true)){
          this.statusOrders = 'approve'
        } else this.scanOrder()
        }, 1000)

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
