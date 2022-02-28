<template>
  <ion-loading
    :is-open="isOpenRef"
    cssClass="my-custom-class"
    message="Por favor Espere Envio..."
    :duration="timeout"
    @didDismiss="setOpen(false)"
  >
  </ion-loading>
  <div
    class="container uk-flex uk-flex-column uk-flex-between"
    :class="{ backg: resultScan }"
  >
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
    <div class="result-info">
      <div
        v-if="!showProduct"
        class="status-order"
        :class="{
          statusError: statusOrders == 'reject',
          statusCheck: statusOrders == 'approved',
        }"
      >
        <div
          v-if="statusOrders == 'approved'"
          style="width: 100%; font-size: 30px"
        >
          <h6 style="font-size: 14px" class="uk-margin-remove">
            {{ completedOrder }}
          </h6>
        </div>
        <div
          v-if="statusOrders == 'reject'"
          style="width: 100%; font-size: 30px"
        >
          <h6 class="uk-margin-remove">
            {{ messageReject }}
            <font-awesome-icon icon="ban" style="color: #be1515" />
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
                <p class="uk-width-1-1">
                  <span class="font-weight-medium">Cliente: </span>
                  <span>{{ order.client_name }}</span>
                </p>
              </div>
            </div>
            <p style="margin-right: 10px !important">
              <span class="font-weight-medium">Orden: </span
              ><span>{{ order.order_num }}</span>
            </p>
            <p class="">
              <span class="font-weight-medium">Cajas / Pallets: </span
              >{{ order?.no_of_boxes }}<span></span>
            </p>
            <p class="uk-width-1-1">
              <span class="font-weight-medium">Destino: </span>
              <span>
                <font-awesome-icon icon="map-marker-alt" />
                {{ order.address }}</span
              >
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
        <div
          v-if="imagiElement.length > 0"
          class="uk-card uk-card-default uk-card-body uk-width-1 img-card"
        >
          <div class="uk-flex img-scroll">
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
                src="../assets/rejected.png"
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
      <label class="uk-width-1-1" style="margin: 0px 0px 10px; font-size: 14px"
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
        <!-- <input type="file" id="file-img" style="position: absolute; opacity: 0" accept="image/*" capture="filesystem"> -->
      </div>
      <div class="button-div">
        <button :class="{disabled: !image}" @click="setImage()" class="uk-button uk-button-blue">
          Aceptar
        </button>
      </div>
    </div>
    <div v-if="cameraOn"></div>
  
    <div v-if="!cameraOn && !image" style="height: 300px">
      <div class="action">
        <ul v-if="!showProduct" class="box-orden">
          <li
            v-for="product in firstStructureLoad"
            :key="product"
            :class="{
              completedOrden: product.completedScanned,
              inProgressOrden: product.scanProgress,
            }"
            style=""
          >
            &nbsp;
          </li>
        </ul>
        <div class="cont uk-card uk-card-default uk-card-hover uk-card-body">
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
    <div  id="deliver-quantity" class="uk-flex-top" uk-modal>
      <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          @click="scanOrder()"
          type="button"
          uk-close
        ></button>

        <p style="font-size: 15px">
          Cantidad (hasta el máximo de
          <span>{{
            totalLimitOfBoxes.totalOfOrders - totalLimitOfBoxes.scanned
          }}</span
          >)
        </p>
        <input
          type="number"
          v-model="quantityForScan"
          :max="totalLimitOfBoxes.totalOfOrders - totalLimitOfBoxes.scanned"
          class="uk-input"
        />
        <p
          class="uk-text-right uk-flex uk-flex-around"
          style="margin-top: 20px !important"
        >
          <button
            class="uk-button uk-button-default uk-modal-close"
            style="margin: 0px 10px"
            @click="scanOrder()"
            type="button"
          >
            Cancelar
          </button>
          <button
            class="uk-button uk-button-primary uk-modal-close"
            @click="sendQuantityForScan()"
            type="button"
          >
            Guardar
          </button>
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
import { Geolocation } from "@capacitor/geolocation";
import { Mixins } from "../mixins/mixins";
import UIkit from "uikit";
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";
import { App } from "@capacitor/app";
import Camera from "simple-vue-camera";


App.addListener("appRestoredResult", (data) => {
  console.log("Restored state:", data);
  let route = JSON.parse(localStorage.getItem("route"));
  if (route) {
    this.$router.push({ name: route }).catch(() => {});
  } else {
    this.$router.push({ name: "load-status" });
  }
});

export default {
  name: "DeliveryActions",
  alias: "Entrega de Ordenes",
  components: {
    timeline,
    IonLoading,
    Camera,

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
        longitude: null,
      },
      statusOrders: "start",
      firstStructureLoad: [],
      secondStructureLoad: [],
      quantityForScan: null,
      totalLimitOfBoxes: {
        scanned: null,
        totalOfOrders: null,
      },
      checkOrder: true,
      messageReject: null,
      showProduct: true,
      timeout: 10000,
      picture: null,
      camera: null,
      image: "",
      cameraOn: false,
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
      "structureToScan",
      "isChangeQuantityStore"
    ]),

    completedOrder: function () {
      if (this.firstStructureLoad.every((x) => x.completedScanned)) {
        return "Todos los Productos han sido Entregados";
      } else {
        return "El Producto ha sido Entregado";
      }
    },
  },
  async mounted() {
    this.$store.commit('setImagiElement',[])

    this.camera = this.$refs.Camera;

    this.load = { ...this.loadStore };
    this.orders = [...this.orderScan];
    this.firstStructureLoad = this.structureToScan.firstStructure;
    this.secondStructureLoad = this.structureToScan.secondStructure;
    this.orders.map((x) => {
      if (x.totalOrdersScanned >= x.totalQuantity) {
        this.step = 1;
      }
      x.completedScanned = false;
    });
    let firstStructure = [];
    let secondStructure = [];
    this.firstStructureLoad.forEach((x) => {
      let data = this.firstStructureLoad.find(
        (p) =>
          p.qrCode === x.qrCode &&
          p.quantity === x.quantity &&
          p.order_num == x.order_num
      );
      if (!data) data = x;
      data.completedScanned = data.loadScanningCounter == data.quantity;
      data.scanProgress =
        data.loadScanningCounter > 0 && !data.completedScanned;
      firstStructure.push(data);
    });
    this.secondStructureLoad.forEach((x) => {
      let data = this.secondStructureLoad.find(
        (p) => p.qrCode === x.qrCode && p.totalOfOrders === x.totalOfOrders
      );
      if (!data) data = x;
      data.completedScanned = data.loadScanningCounter == data.totalOfOrders;
      data.scanProgress =
        data.loadScanningCounter > 0 && !data.completedScanned;
      secondStructure.push(data);
    });

    await this.getLocation();
    this.firstStructureLoad = firstStructure;
    this.secondStructureLoad = secondStructure;

    if (this.secondStructureLoad.every((x) => x.completedScanned)) {
      this.allProductScanned = true;
      this.verifiedLoad();
    }
  },
  watch: {
    digitalFirmStore: {
      handler: async function (newVal) {
        if (newVal !== null) {
          this.firm = newVal;
          this.setOpen(true);
          await this.postImages();

          let delay = (ms) => new Promise((res) => setTimeout(res, ms));
          await delay(5000);

          try {
            let load = await this.$services.loadsServices.getLoadDetails(
              this.load.loadMapId
            );
            let allProductScanned = [];

            load.Orders.forEach((x) => {
              allProductScanned.push(
                x.products.every(
                  (prod) => prod.loadScanningCounter >= prod.quantity
                )
              );
            });

            let allOrderScanned = JSON.parse(
              localStorage.getItem("allOrderScanned")
            );

            if (!allOrderScanned) {
              localStorage.setItem(
                "allOrderScanned",
                JSON.stringify(this.orders)
              );
            } else {
              allOrderScanned = [...allOrderScanned, ...this.orders];
              localStorage.setItem(
                "allOrderScanned",
                JSON.stringify(allOrderScanned)
              );
            }

            if (allProductScanned.every((x) => x == true)) {
              localStorage.setItem(`sendInfo${this.load.loadMapId}`, true);
              localStorage.removeItem(`allProducts${this.load.loadMapId}`);
              this.$router.push({ name: "home" }).catch(() => {});
              await this.changeRouteLoads("Delivered", this.load);
            } else {
              this.$router.push({ name: "delivery-routes" });
            }
          } catch (error) {
            await this.changeRouteLoads("Delivered", this.load);
            this.$router.push({ name: "home" }).catch(() => {});
            localStorage.removeItem(`allProducts${this.load?.loadMapId}`);
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
    imagiElement:{
      handler: function(newVal){
        console.log(newVal, 'si')
        this.$store.commit('setImagiElement',newVal)
      }, deep: true
    },

    quantityForScan: function (newVal) {
      if (
        newVal >
        this.totalLimitOfBoxes.totalOfOrders - this.totalLimitOfBoxes.scanned
      ) {
        this.quantityForScan =
          this.totalLimitOfBoxes.totalOfOrders - this.totalLimitOfBoxes.scanned;
      }
    },
    firstStructureLoad: {
      handler: function (newVal) {
        if (newVal) {
          this.firstStructureLoad.forEach((x) => {
            x.completedScanned = x.loadScanningCounter >= x.quantity;
            x.scanProgress = x.loadScanningCounter > 0 && !x.completedScanned;
          });
          if (this.firstStructureLoad.every((x) => x.completedScanned)) {
            if (!this.allProductScanned) this.allProductUpload();
            else this.verifiedLoad();
          }
        }
      },
      deep: true,
    },
    secondStructureLoad: {
      handler: function (newVal) {
        if (newVal) {
          this.secondStructureLoad.forEach((x) => {
            x.completedScanned = x.loadScanningCounter >= x.quantity;
            x.scanProgress = x.loadScanningCounter > 0 && !x.completedScanned;
          });
        }
      },
      deep: true,
    },
    exception: {
      handler: function (newVal) {
        if (newVal) {
          this.step = 1;
          this.stopScan();
        } else if (
          newVal === false &&
          this.orders.some((x) => {
            return x.products.some((z) => z.loadScanningCounter !== 0);
          }) === false
        ) {
          this.step = 0;
        }
      },
      deep: true,
    },
  },

  methods: {
    getShow(value) {
      this.show = value;
      if (value === "scan") {
        this.resultScan = false;
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
      this.cameraOn = true;
      await this.camera?.start();
    },

    shipperName(val) {
      var shipper = val?.shipper?.find((x) => x.name);
      return shipper?.name;
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
        this.$services.deliverServices.postImages(
          images,
          this.location.latitude,
          this.location.longitude,
          order._id
        );
      }
        let resultId = []
        console.log(this.orders ,'orders')
        this.orders.forEach(x => {
          if(!x.products.every(product => product.loadScanningCounter >= product.quantity)){
           resultId.push(x._id)
          }
        })
        console.log(this.causeExceptionsStore, 'this.causeExceptionsStore')
        if (this.causeExceptionsStore && resultId.length > 0) {
         for (let x = 0; x < resultId.length; x++) {
            this.$services.exceptionServices.putExceptions(resultId[x], this.causeExceptionsStore);
           
         } 
        }
      if (this.causeExceptionsStore && resultId.length > 0) {
        for (let x = 0; x < resultId.length; x++) {
          this.$services.exceptionServices.putExceptions(
            resultId[x],
            this.causeExceptionsStore
          );
        }
      }
    },

    async uploadProducts(val) {
      let orderForScan = this.firstStructureLoad.find(
        (x) =>
          x.qrCode == val &&
          x.loadScanningCounter < x.quantity &&
          !x.completedScanned
      );
      if (orderForScan) {
        let detailsOrderToScan = this.secondStructureLoad.find(
          (x) => x.qrCode == orderForScan.qrCode
        );
        if (
          detailsOrderToScan.loadScanningCounter >=
          detailsOrderToScan.totalOfOrders
        ) {
          Vibration.vibrate(1000);
          this.statusOrders = "reject";
          this.showProduct = false;
          this.messageReject =
            "Ya estan escaneadas todas las ordenes con este qrcode";
          setTimeout(() => {
            this.showProduct = true;
            this.statusOrders = "start";
            this.scanOrder();
          }, 1000);
        } else {
          let order = this.load.Orders.filter(
            (order) => order._id == orderForScan._id
          );
          order = order.find((x) => x);
          let productInfo = order.products.find(
            (p) => p?.qrCode == val && orderForScan.order_num == order.order_num
          );
          if (productInfo?.scanOneByOne === "no") {
            let noScan1by1 = 0;
            let listNoScan1by = this.firstStructureLoad.filter(
              (x) => x.scanOneByOne == "no" && x.qrCode == val
            );
            listNoScan1by.forEach((x) => {
              noScan1by1 += x.quantity;
            });
            this.totalLimitOfBoxes.scanned =
              detailsOrderToScan.loadScanningCounter;
            this.totalLimitOfBoxes.totalOfOrders = noScan1by1;
            UIkit.modal("#deliver-quantity").show();
            this.infoForScan = {
              orderId: order._id,
              boxId: productInfo._id,
              loadScanningCounter: productInfo.loadScanningCounter,
              productId: productInfo.product._id,
              productQrCode: productInfo.qrCode,
              quantity: productInfo.quantity,
              scanOneByOne: false,
            };
          } else {
            await this.setMessageConfirmation(
              order._id,
              productInfo._id,
              productInfo.loadScanningCounter,
              productInfo.product,
              productInfo.qrCode,
              productInfo.quantity,
              true
            );
          }
        }
      } else {
        if (this.secondStructureLoad.some((x) => x.qrCode == val)) {
          Vibration.vibrate(1000);
          this.messageReject =
            "Ya estan escaneadas todas las ordenes con este qrcode";
          this.showProduct = false;
          this.statusOrders = "reject";

          setTimeout(() => {
            this.showProduct = true;
            this.statusOrders = "start";
            this.scanOrder();
          }, 1000);
        } else {
          this.statusOrders = "reject";
          this.messageReject = "Error, producto no reconocido";
          this.resultScan = false;
          this.showProduct = false;

          Vibration.vibrate(1000);
          setTimeout(() => {
            this.statusOrders = "start";
            this.showProduct = true;
            this.scanOrder();
          }, 1000);
        }
      }
    },
    async setMessageConfirmation(
      orderId,
      boxId,
      loadCounter,
      productId,
      qrCode,
      quantity,
      scanOneByOne
    ) {
      let index_first = this.firstStructureLoad.findIndex(
        (x) =>
          x.qrCode === qrCode && x.quantity == quantity && !x.completedScanned
      );
      let index_second = this.secondStructureLoad.findIndex(
        (x) => x.qrCode == qrCode
      );

      if (scanOneByOne) {
        this.firstStructureLoad[index_first].loadScanningCounter += 1;
        this.secondStructureLoad[index_second].loadScanningCounter += 1;
        this.$services.deliverServices.deliverProduct(
          orderId,
          boxId,
          this.secondStructureLoad[index_second].loadScanningCounter,
          productId,
          qrCode
        );
      } else {
        if (loadCounter > this.firstStructureLoad[index_first].quantity) {
          let LoadDistribute = loadCounter - this.firstStructureLoad[index_first].quantity;
          let secondLoadDistribute = loadCounter - LoadDistribute;

          this.secondStructureLoad[index_second].loadScanningCounter +=
            secondLoadDistribute;
          this.firstStructureLoad[index_first].loadScanningCounter +=
            secondLoadDistribute;

          await this.$services.deliverServices.deliverProduct(
            orderId,
            boxId,
            secondLoadDistribute,
            productId,
            qrCode
          );
          await this.distributeProductScan(LoadDistribute, qrCode);
        } else {
          this.firstStructureLoad[index_first].loadScanningCounter +=
            loadCounter;
          await this.$services.deliverServices.deliverProduct(
            orderId,
            boxId,
            this.firstStructureLoad[index_first].loadScanningCounter,
            productId,
            qrCode
          );

          this.secondStructureLoad[index_second].loadScanningCounter +=
            loadCounter;
        }
      }
      let data = {
        firstStructure: this.firstStructureLoad,
        secondStructure: this.secondStructureLoad,
        name: this.load.loadMapId,
      };
      await this.$store.dispatch("changeLoadScannedInStore", data);

      this.verifiedLoad();
    },
    async scanOrder() {
      this.quantityForScan = null;
      this.statusOrders = "start";
      if (await this.checkPermission()) {
        this.showProduct = false;
        BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
        if (result.hasContent) {
          BarcodeScanner.hideBackground();
          this.uploadProducts(result.content);
        } else {
          this.statusOrders = "start";
        }
      }
    },

    async sendQuantityForScan() {
      let {
        orderId,
        boxId,
        loadScanningCounter,
        productId,
        productQrCode,
        quantity,
        scanOneByOne,
      } = this.infoForScan;
      loadScanningCounter = this.quantityForScan;
      await this.setMessageConfirmation(
        orderId,
        boxId,
        loadScanningCounter,
        productId,
        productQrCode,
        quantity,
        scanOneByOne
      );
      this.quantityForScan = null;
    },

    async distributeProductScan(LoadDistribute, qrCode) {
      var orderForScan = this.firstStructureLoad.find(
        (x) =>
          x.qrCode == qrCode &&
          x.loadScanningCounter < x.quantity &&
          !x.completedScanned
      );
      if (orderForScan) {
        let index_first = this.firstStructureLoad.findIndex(
          (x) =>
            x.qrCode === orderForScan.qrCode &&
            x.loadScanningCounter < x.quantity
        );
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
        this.secondStructureLoad[index_second].loadScanningCounter +=
          LoadDistribute;
        this.firstStructureLoad[index_first].loadScanningCounter +=
          LoadDistribute;

        await this.$services.deliverServices.deliverProduct(
          order._id,
          productInfo._id,
          LoadDistribute,
          productInfo.product,
          qrCode
        );
      }
    },
    async getLocation() {
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
        return true;
      }
      this.status = false;
      return true;
    },
    changeRoute(val) {
      this.$router.push({ name: val }).catch(() => {});
    },

    async verifiedLoad() {
      this.allProductScanned = true;
      this.checkOrder = true;
      this.statusOrders = "approved";
      this.showProduct = false;
      setTimeout(async () => {
        this.statusOrders = "start";
        this.showProduct = true;

        this.checkOrder = false;
        if (this.firstStructureLoad.every((x) => x.completedScanned)) {
          this.resultScan = true;
          this.step = 1;
          localStorage.removeItem("LoadScanned");
          let quantityTotal = 0;
          this.load.Orders.forEach((x) => (quantityTotal += x.no_of_boxes));
        } else this.scanOrder();
      }, 1000);
    },
    deleteImage(i) {
      this.imagiElement.splice(i, 1);
    },
    allProductUpload() {
      this.statusOrders = "start";
      this.resultScan = true;
      this.step = 1;
    },
    async updateData() {
      try {
        if (this.$route.name == "deliveryActions") {
          let load = await this.$services.loadsServices.getLoadDetails(
            this.load.loadMapId
          );
          if (load.loadingStatus.text == "Delivered") {
            this.firstStructureLoad.forEach((x) => {
              x.loadScanningCounter = x.quantity;
            });
            this.verifiedLoad();
          } else {
            for (let i = 0; i < load.Orders.length; i++) {
              const order = load.Orders[i];

              if (
                this.firstStructureLoad.some(
                  (x) => x.order_num == order.order_num
                )
              ) {
                let structure = await this.setStructure(order);

                for (
                  let cont = 0;
                  cont < structure.firstStructure.length;
                  cont++
                ) {
                  const product = structure.firstStructure[cont];
                  this.firstStructureLoad.forEach((x) => {
                    if (
                      x.qrCode == product.qrCode &&
                      x?.quantity === product?.quantity
                    ) {
                      if (
                        product.loadScanningCounter != x.loadScanningCounter
                      ) {
                        x.loadScanningCounter = product.loadScanningCounter;
                      }
                    }
                  });
                }

                for (
                  let cont = 0;
                  cont < structure.secondStructure.length;
                  cont++
                ) {
                  const product = structure.secondStructure[cont];
                  this.secondStructureLoad.forEach((x) => {
                    if (x.qrCode == product.qrCode) {
                      x.loadScanningCounter = product.loadScanningCounter;
                    }
                  });
                }
              }
            }
          }
        }
      } catch (error) {
        return false;
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
      console.log(this.imagiElement, 'image');
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
      console.log(this.image);
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
.uk-card-body {
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
.statusError {
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
.statusCheck {
  background: rgb(255, 255, 255) !important;
  box-shadow: 0px 0px 7px green !important;
  color: #fff !important;
}
.img-result {
  width: 98%;
  height: 80px;
  border: 1px solid #000;
}
.icon-close {
  background-color: #f04c3b40;
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
p {
  margin: 2px 0px !important;
}
.img-scan {
  width: 39px;
}
.box-orden {
  list-style: none;
  display: flex;
  padding: 0px;
  width: 100%;
  flex-wrap: wrap;
  padding: 0px 20px;
  margin: 5px 0px;
}
.box-orden li {
  width: 25px;
  border: 1px solid #a2a2a2;
  margin: 1px;
}
.status-order {
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
  animation-play-state: running !important;
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
.checkScreen {
  background: rgba(11, 134, 0, 0.1);
}
.banScreen {
  background: rgba(255, 138, 138, 0.1) !important;
}
.completedOrden {
  background: green;
}
.inProgressOrden {
  background: #fff500;
}
.cont {
  z-index: 0;
  padding: 15px 5px !important;
}
.action {
  position: absolute;
  bottom: 0px;
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
.button-cancel{
  margin: 0px 10px; 
  background: #930404;
  color: #fff
}
</style>
