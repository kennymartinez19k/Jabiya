<template>
  <div
    class=" uk-flex uk-flex-column uk-flex-between"
    :class="{ backg: resultScan }"
  >
    <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeOut"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>

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
            ><span>&nbsp; {{ load?.firstOrdenInfo.sector }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="result-info" v-if="!cameraOn && !image">
      <ul class="uk-list uk-list-divider" style="list-style: none">
        <div
          v-for="order in orders"
          :key="order"
          class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
          :class="{ ordenCompleted: order.completed }"
        >
          <div class="uk-text-left info-user uk-flex uk-flex-wrap">
            <div class="btn uk-flex">
              <div class="uk-flex uk-flex-column uk-text-left">
                <p class="uk-width-1-1">
                  <span class="font-weight-medium web-font-small">Cliente: </span>
                  <span>{{ order.client_name }}</span>
                </p>
              </div>
            </div>
            <p style="margin-right: 10px !important">
              <span class="font-weight-medium web-font-small">Orden: </span
              ><span>{{ order.order_num }}</span>
            </p>
            <p class="">
              <span class="font-weight-medium web-font-small">Cajas / Pallets: </span
              >{{ order?.no_of_boxes }}<span></span>
            </p>
            <p class="uk-width-1-1">
              <span class="font-weight-medium web-font-small">Destino: </span>
              <span>
                <font-awesome-icon icon="map-marker-alt" />
                {{ order.address }}</span
              >
            </p>
          </div>
          <div>
            <div
              @click="setMap(order)"
              class="uk-flex-column"
              style="align-items: center; display: inline-flex"
            >
              <img src="../../assets/map.png" class="img-scan" alt="" />
              <span class="web-font-small">Ver Ruta</span>
            </div>
          </div>
        </div>

        <div
          v-if="imagiElement.length > 0"
          class="uk-card uk-card-default uk-card-body uk-width-1 img-card"
          style="padding: 5px 0px 10px !important"
        >
          <div class="uk-flex uk-flex-wrap img-scroll">
            <span
              v-for="(src, index) in imagiElement"
              :key="src"
              style="
                position: relative;
                width: 85px;
                display: flex;
                margin: 0px 10px;
              "
            >
              <img class="img-result" :src="src" alt="Red dot" />
              <img
                src="../../assets/rejected.png"
                class="icon-close"
                @click="deleteImage(index)"
                alt=""
              />
            </span>
          </div>
        </div>
      </ul>
    </div>
    <div v-if="image" class="showCamera">
      <font-awesome-icon
        v-if="cameraOn || image"
        icon="times"
        class="close"
        @click="stopCamera()"
      />
      <img class="result-scan" :src="image" alt="" />
    </div>
    <div :class="{ showCamera: cameraOn, hideCamera: !cameraOn }">
      <font-awesome-icon
        v-if="cameraOn"
        icon="times"
        class="close"
        @click="stopCamera()"
      />
      <camera
        class="camera"
        :resolution="{ width: 1620, height: 1450 }"
        ref="Camera"
      ></camera>
    </div>
    <div
      v-if="cameraOn || image"
      class="
        cont-camera
        uk-flex-between
        uk-flex-wrap
        uk-card
        uk-card-default
        uk-card-hover
        uk-card-body
      "
      style="z-index: 0; padding: 4px 0px !important; border: 1px solid #ccc"
    >
      <label class="uk-width-1-1 web-font-small" style="margin: 0px 0px 10px; font-size: 14px"
        >Tomar las Fotos</label
      >
      <label class="img-div" style="position: relative">
        <font-awesome-icon icon="images" />
        <input
          type="file"
          @change="pickImage($event)"
          id="file-img"
          style="position: absolute; opacity: 0"
          accept="image/*"
        />
      </label>

      <div class="snapshot-div">
        <div @click="snapshot()" class="take-photo"></div>
      </div>
      <div class="button-div">
        <button :class="{disabled: !image}" @click="setImage()" class="uk-button uk-button-blue web-font-small">
          Aceptar
        </button>
      </div>
    </div>
    <div v-if="cameraOn"></div>
    <div
      v-if="!cameraOn && !image"
      class="cont uk-card uk-card-default uk-card-hover uk-card-body"
      style="z-index: 0; padding: 16px 0px !important"
    >
      <h6 style="margin: 0px 0px 10px; font-size: 14px">
        Click Para Tomar las Fotos y Firma
      </h6>
      <timeline
        :step="step"
        :exception="exception"
        :resultScan="resultScan"
        :imagiElement="imagiElement"
        :showSignaturform="showSignaturform"
        @action="getShow($event)"
        @resetSign="resetSign()"
      />
    </div>
  </div>
</template>

<script>
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { ref } from "vue";
import { Geolocation } from "@capacitor/geolocation";
import { mapGetters } from "vuex";
import timeline from "../../components/timeline-action.vue";
import { IonLoading } from "@ionic/vue";
import { Mixins } from "../../mixins/mixins";
import { profile } from "../../types";
import Camera from "simple-vue-camera";

export default {
  name: "DeliveryActions",
  alias: "Retornar Contenedor",

  components: {
    timeline,
    IonLoading,
    Camera,
  },
  mixins: [Mixins],

  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  data() {
    return {
      show: null,
      orders: null,
      resultScan: null,
      cont: 0,
      load: null,
      imagiElement: [],
      imagiToApi: [],
      step: 1,
      exception: false,
      firm: null,
      location: {
        latitude: null,
        longitude: null,
      },
      timeOut: null,
      showSignaturform: false,
      picture: null,
      camera: null,
      image: "",
      cameraOn: false,
    };
  },
  computed: {
    ...mapGetters([
      "orderScan",
      "loadStore",
      "exceptionStore",
      "digitalFirmStore",
      "settings",
      "allLoadsStore",
    ]),
  },

  async mounted() {
    this.camera = this.$refs.Camera;
    if (this.loadStore?.loadMapId) {
     this.load = {...this.loadStore};
    } else {
      this.load = JSON.parse(localStorage.getItem('DeliveryCharges'));
      this.$store.commit("setloadStore", this.load);
    }

    let loadsMounted = this.loadStore;
    if (this.loadStore) {
      this.$store.commit("setloadStore", loadsMounted);
    }

    if (this.load?.loadType == profile?.container) {
      this.orders = this.load?.Orders.filter(x => x.isReturn);
    } else {
       if (this.orderScan?.length) {
        this.orders = this.orderScan;
      } else {
        this.orders = JSON.parse(localStorage.getItem("scanOrder"))
        this.$store.commit("scanOrder", this.orders );
      }
    }
    this.showSignaturform = this.orders.some((x) => x.isReturn);

    if (this.orderScan?.length > 1) {
      this.$emit("setNameHeader", `Entrega de Ordenes`);
    } else if (this.orderScan?.length == 1) {
      this.$emit(
        "setNameHeader",
        `Entrega de Orden No. ${this.orderScan[0]?.numberOfOrders}`
      );
    }
    this.load.firstOrdenInfo = this.load?.Orders[0];
    await this.getLocation();
  },
  watch: {
    digitalFirmStore: {
      handler: async function (newVal) {
        if (newVal !== null) {
          this.firm = newVal;
          this.uploadOrDownload(this.orders);
          this.postImages();

          let delay = (ms) => new Promise((res) => setTimeout(res, ms));
          await delay(5000);

          try {

            localStorage.setItem(`sendInfo${this.load?.loadMapId}`, true);
            localStorage.removeItem(`allProducts${this.load?.loadMapId}`);
            await this.changeRouteLoads("Delivered", this.load);
            this.$router.push({ name: "home" });
            
          } catch (error) {
            this.$router.push({ name: "home" }).catch(() => {});
          }
          this.setOpen(false);
        }
      },
    },
    $route: function (newVal) {
      if (newVal) {
        this.stopScan();
      }
    },
  },

  methods: {
    async getLocation() {
      if(!this.load?.Vehicles[0]?.gpsProvider || this.load.Vehicles[0].gpsProvider == 'Flai Mobile App'){
          try {
            const geo = await Geolocation.getCurrentPosition();
            this.location.latitude = geo.coords.latitude;
            this.location.longitude = geo.coords.longitude;
          } catch (error) {
            if(error.message == 'location disabled'){
              this.alertUbication('Active la ubicacion', 'Porfavor debe encender la ubicacion, para continuar el siguiente paso' )
            }
            if(error.message == 'Location permission was denied'){
              this.alertUbication('Ubicacion denegada', 'Por favor permita que la aplicacion pueda acceder a permiso de ubicacion' )
            }
            if(error.message == 'User denied Geolocation'){
              this.alertUbication('Ubicacion denegada', 'Por favor permita que la aplicacion pueda acceder a permiso de ubicacion' )
            }
            return false
          }
        }else{
          // Server gps
          let result = await this.$services.gpsProviderServices.getVehicleGpsId(this.load.Vehicles[0].gpsId)
          this.location.latitude = result?.lat
          this.location.longitude = result?.lng
        }
        
    },
    async checkPermissions() {
      return await Geolocation.checkPermissions();
    },
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

    verificacion(orders, result) {
      for (let i = 0; i < orders.length; i++) {
        if (i?.numberOfOrders === result.content) {
          return true;
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
      this.cameraOn = true;
      await this.camera?.start();
    },

    
    shipperName(val) {
      var shipper = val?.shipper?.find((x) => x.name);
      return shipper?.name;
    },

    
    async setMap(val) {
      await this.getLocation();
      window.open(
        `https://www.google.com/maps/dir/'${this.location.latitude},${this.location.longitude}'/${val.latitude},${val.longitude}/`
      );
      this.$store.commit("setStartRoute", false);
    },

    async postImages() {
      let unreturnedOrders = this.orders.filter((x) => x.isReturn);
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
        this.$services.deliverServices.postImages(
          images,
          this.location.latitude,
          this.location.longitude,
          order._id
        );
      }
    },

    uploadOrDownload(val) {
      this.setLoadTruck(val);
    },
    setLoadTruck(val) {
      this.timeOut = 10000;
      this.setOpen(true);
      let totalOfBoxes = 0;
      let orders = val.filter((x) => x.isReturn);
      for (let cont = 0; cont < orders.length; cont++) {
        let order = orders[cont];
        totalOfBoxes += order.no_of_boxes;
        for (var i = 0; i < order.products.length; i++) {
          let prod = order.products[i];
          try {
            if (prod.scanOneByOne === "no") {
              prod.loadScanningCounter = prod.quantity;
              this.$services.deliverServices.deliverProduct(
                order._id,
                prod._id,
                prod.loadScanningCounter,
                prod.product,
                prod.qrCode
              );
            } else {
              for (let i = 0; i <= prod.quantity; i++) {
                prod.loadScanningCounter = i;
                this.$services.deliverServices.deliverProduct(
                  order._id,
                  prod._id,
                  prod.loadScanningCounter,
                  prod.product,
                  prod.qrCode
                );
              }
            }
          } catch (error) {
            if (error.message === "Request failed with status code 401") {
              console.log("Error al introducir los datos");
            } else if (error.message === "Network Error") {
              console.log("Error de conexion, verifique que este conectado");
            }
          }
        }
      }
      return totalOfBoxes;
    },
    deleteImage(index) {
      this.imagiElement.splice(index, 1);
      if (this.imagiElement.length === 0) {
        this.step = 1;
      }
    },
    resetSign() {
      this.step = 2;
    },

    async snapshot() {
      const blob = await this.camera?.snapshot({ width: 1620, height: 1450 });
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      let img;
      reader.onloadend = async function () {
        img = reader.result;
      };
      let delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(1000);
      this.image = img;
      this.cameraOn = false;
    },
    setImage() {
      this.imagiElement.push(this.image);
      if (this.imagiElement.length > 0) {
        this.step = 2;
      }
      this.stopCamera();
    },

    async stopCamera() {
      this.cameraOn = false;
      this.image = null;
      await this.camera?.stop();
    },
    async pickImage(event) {
      let blob = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      let img;
      reader.onloadend = async function () {
        img = reader.result;
      };
      let delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(1000);
      this.cameraOn = false;
      this.image = img;
    },
  },
};
</script>
<style scoped>
.qr {
  width: 60%;
}
p {
  margin: 2px 0px !important;
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
.checkbox-default:checked + .onoffswitch-label{
  background-color: #898989 !important;
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
  margin: 0px -15px;
}
.backg {
  background-color: rgb(255, 255, 255);
}
.result-info {
  overflow: auto;
  padding: 0px 10px;
  height: 100vh;
}
.stiky {
  color: rgb(255, 255, 255) !important;
  z-index: 0;
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
  width: 98%;
  height: 80px;
  margin-top: 10px;
  border: 1px solid #000;
}
.img-scroll {
  width: 98%;
  padding: 10px 0px;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
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
.uk-card-body {
  padding: 8px 20px 16px;
}
.cont {
  position: sticky;
  bottom: 0px;
  border-top: 1px solid #ccc;
}
.icon-close {
  background-color: #f04c3b40;
  position: absolute;
  right: -14px;
  top: 0px;
  width: 22px;
  border-radius: 10px;

  margin: 2px 0px 0px -23px;
}
.img {
  position: absolute;
  padding: 6px 5px;
  bottom: 125px;
}
.img-card {
  width: 100%;
  padding: 0px !important;
}

.showCamera {
  position: fixed;
  top: 105px;
  display: flex;
  background: #000;
  width: 100%;
  flex-direction: column;
  height: 420px;
  justify-content: center;
  align-items: center;
}
.hideCamera {
  display: none;
}
.close {
  position: absolute;
  top: 10px;
  z-index: 2;
  right: 5%;
  font-size: 35px;
  color: white;
  background: #676464;
  padding: 6px;
  border-radius: 20px;

  width: 34px;
}
.take-photo {
  height: 60px;
  background: #000;
  width: 60px;
  border-radius: 30px;
  border: 5px solid #ccc;
}
.cont-camera {
  z-index: 0px;
  display: flex;

  padding: 4px 0px !important;
  border: 1px solid #ccc;
  position: fixed;
  bottom: 0px;
  width: 100%;
}
.result-scan {
  height: auto;
  max-height: 100%;
}
.camera {
  height: 200px;
}
#file-img {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
}
.img-div {
  width: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  font-size: 35px !important;
  align-items: center;
  width: 20%;
}
.button-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0px 5px;
  width: 20%;
  align-items: center;
}
.snapshot-div {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
}
.disabled{
  background-color: transparent;
  color: #999;
  border: 1px solid #e5e5e5;
  pointer-events: none;
}
.position-imagin {
  position: relative;
  width: 77px;
  display: flex;
  margin: 0px 10px;
}

.pad-car {
  padding: 5px 0px 10px !important;

}
@media (min-width: 630px){
  .uk-container {
  margin: 0px -30px;
}
.exception {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;
  font-weight: 600;
}
}
@media (min-width: 960px){
  .container-item {
  width: 100%;
  margin: 0px auto;
}
 span {
   font-size: 16px;
 }
}
</style>