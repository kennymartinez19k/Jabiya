<template>
  <div class="uk-container uk-flex uk-flex-column uk-flex-between" :class="{backg: resultScan}">
    <div class="stiky">
      <p
        style=" font-size: 13px; !important; font-weight: 500"
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
            <span class="font-weight-medium">Shipper: </span><span>&nbsp; {{ load?.shipper }}</span>      
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span><span>&nbsp; {{ load?.shipperZone }}</span>
          </p>
          
          
        </div>
        
      </div>
    </div>
    <div 
      class="result-info"
      v-if="resultScan"
      >
      <ul
        class="uk-list uk-list-divider"
        style="list-style: none"
      >
      <div
        v-for="order in orders"
        :key="order"
        class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
      >
        <div class="uk-text-left info-user uk-flex uk-flex-wrap">
          <div class="btn uk-flex">
            <div class="uk-flex uk-flex-column uk-text-center">
              <p
                style="font-size: 14px !important;"
                class="uk-width-1-1"
              >
              <span style="font-weight: 600">Cliente: </span>
                <span>{{ order?.client_name }}</span>
              </p>
            </div>
            <span>
              <img src="../../assets/box.png" alt="" />
            </span>
          </div>
          <p class="uk-width-1-1">
            <strong>Dirección: </strong><span>{{ order?.sector }}</span>
          </p>
          <p class="uk-width-1-2">
            <strong> No. de Orden: </strong
            ><span>{{ order?.order_num }}</span>
          </p>
          <p class="uk-width-1-2">
            <strong>No. de Cajas: </strong>{{ order?.products.length }}<span></span>
          </p>
          <div
            class="uk-flex uk-width-1-1 uk-flex-between"
            style="margin-top: 10px"
          >
            <div class="uk-width-1-2">
              <div
                class="uk-flex-column"
                style="align-items: center; display: inline-flex"
              >
                <img src="../../assets/map.png" class="img-scan" alt="" />
                <span>Ver Ruta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="uk-flex" style="margin-top: 10px" >
              <img class="img-result" v-for="src in imagiElement" :key="src" :src="src" alt="Red dot" />
              <img class="img-result" :src="firm" alt="Fima Digital" />
          </div>
      </ul>
    </div>
    <div
      class="cont uk-card uk-card-default uk-card-hover uk-card-body"
      style="z-index: 0; padding: 15px 0px  !important;"
    >
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
import timeline from "../../components/timeline.vue";
import { Camera, CameraResultType } from "@capacitor/camera";
export default {
  name: "DeliveryActions",
  alias: 'Procesar Entrega',

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
    };
  },
  computed: {
    ...mapGetters([
      "orderScan",
      "loadStore",
      "exceptionStore",
      "digitalFirmStore",
      "settings",
      'allLoads',
    ]),
  },
  mounted() {
    if(this.loadStore){
       this.load = this.loadStore;
       this.orders = this.orderScan
    }else{
      this.load = this.allLoads.find(x => x.status == "Driver Arrival" )
      this.orders = this.load.orders
    }
    if (this.orderScan?.length > 1) {
      this.$emit("deliveryActions", `Entrega de Ordenes`);
    } else if (this.orderScan?.length == 1) {
      this.$emit(
        "deliveryActions",
        `Entrega de Orden No. ${this.orderScan[0]?.numberOfOrders}`
      );
    }
    if(!this.settings?.AutoScan){
      this.getShow("scan")
    }else{
      this.step++
      this.resultScan = true
    }
  },
  watch: {
    digitalFirmStore: {
      handler: function (newVal) {
        if (newVal !== null) {
          this.firm = newVal;
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
      } else if (value === "camera" && this.imagiElement.length <= 6) {
        this.getCam();

      } else if (value === "firm") {
        this.serieA = value;
        this.step++;
      }
    },
    async scanOrder() {
             
          if (await this.checkPermission()) {
          BarcodeScanner.hideBackground();
          const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
          if (result.hasContent) {
            BarcodeScanner.hideBackground();
              this.resultScan = result
                 this.step++;
            var OrderElement = this.ordersScan.findIndex(x => x.numberOfOrders == result.content)
            if (OrderElement > -1) {
              console.log(OrderElement)
            } else if (OrderElement ){
              Vibration.vibrate(1000);
              setTimeout(() => {
                  this.scanOrder()
              }, 1000)
            }
          }
        }
      },

      verificacion(orders, result) {
        for (let i = 0; i < orders.length; i++) {
          if (i?.numberOfOrders === result.content) {
            return true
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
      console.log('sss')
      this.getCheckPermissions();
      const ele = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        limit: 3,
        resultType: CameraResultType.Base64,
      });
      const image = `data:image/${ele.format};base64, ${ele.base64String}`;
      this.imagiElement.push(image);

      if (this.imagiElement.length === 3) {
        this.step++;
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
        console.log(error, "error");
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
.uk-container {
  margin: 0px -16px;

}
.backg {
    background-color: rgb(255, 255, 255);

}
.result-info {
  overflow: scroll;
  padding: 0px 10px;
  height: 100vh;
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
.img-result {
  width: 21%;
  height: 60px;
  margin-right: 5px;
  border: 1px solid #000;
}
.btn {
  display: flex;
  align-items: baseline;
  width: 100%;
}
.img-scan {
  width: 39px;
}
.btn img {
  width: 20px;
  position: relative;
  top: -2px;
  margin-left: 5px;
}
.uk-card-body{
  padding: 16px 15px;
}

</style>
