<template>
  <div class="container">
    <div
      class="cont uk-card uk-card-default uk-card-hover uk-card-body"
      :class="{ Error: aproveOrden == 3, Success: aproveOrden == 2 }"
      style="z-index: 0; padding: 15px 0px !important"
    >

      <div v-if="aproveOrden == 1">
        <h4>
          Escanee su Orden
          <img src="../assets/parcel.png" class="waitScan" alt="" />
        </h4>
        <p style="font-size: 14px">Verifique su orden para cargarla al camion</p>
        
      </div>
      <div v-if="aproveOrden == 2" class="uk-flex uk-flex-column" style="align-items: center">
        <button class="uk-button uk-button-purple uk-width-1-2 uk-button-small" @click="changeRoute('orders')" style="margin-bottom: 10px; width: 80%">Escanear Siguiente</button>
        <button class="uk-button uk-button-transparent uk-width-1-2 uk-button-small" @click="changeRoute('orders')" style="margin-bottom: 10px; width: 80%">Finalizar carga</button>
      </div>
      <div v-if="aproveOrden == 3" class="uk-flex uk-flex-column" style="align-items: center">
        <button class="uk-button uk-button-purple uk-button-small" @click="scanOrder()" style="margin-bottom: 10px; width: 80%">Escanear de Nuevo</button>
        <button class="uk-button uk-button-red uk-button-small" @click="changeRoute('orders')" style="width: 80%">Salir</button>
      </div>
    </div>
    <div>
      <div
        class="allScreen"
        :class="{
          verifiedScreen: aproveOrden == 2,
          errorScreen: aproveOrden == 3,
        }"
      >
      <div></div>
      <button @click="aproveOrden++">change</button>
      
        <div v-if="aproveOrden == 2" style="width: 100%; font-size: 80px">
          <font-awesome-icon icon="check-circle" class="check" />
          <h5 class="statusCheck">LA ORDEN HA SIDO CARGADA</h5>
        </div>
        <div v-if="aproveOrden == 3" style="width: 100%;; font-size: 80px">
          <font-awesome-icon icon="ban" class="ban" />
          <h5 class="statusError">ERROR, ORDEN NO RECONOCIDA
            <p style="font-size: 14px">Verifique si es la orden correcta</p>
          </h5>
        </div>
        <ul class="">
          <li>
            <img v-if="aproveOrden == 1" src="../assets/package-unloaded.png" srcset="">
            <img v-if="aproveOrden == 2" src="../assets/package-loaded.png">
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { mapGetters } from "vuex";
import { Vibration } from "@ionic-native/vibration";
import { Geolocation } from "@capacitor/geolocation";

export default {
  data() {
    return {
      countdown: 10,
      camera: "auto",
      aproveOrden: 1,
      cont: 0,
      orders: [],
      showScanConfirmation: false,
      location1: {
        latitude: null,
        longitude: null,
      },
    };
  },
  computed: {
    ...mapGetters(["orderScan"]),
  },
  mounted() {
    this.orders = this.orderScan;
    this.scanOrder();
  },
  methods: {
    async location() {
      try {
        const geo = await Geolocation.getCurrentPosition();
        this.location1.latitude = geo.coords.latitude;
        this.location1.longitude = geo.coords.longitude;
        console.log("Current position:", this.location1);
      } catch (e) {
        if (e.code === 1 || e.message === "location disabled") {
          alert("Debe activar la localización.");
        } else {
          alert("Error inesperado. Favor contactese con el Administrador.");
        }
        console.log(e);
      }
    },
    async scanOrder() {
      this.aproveOrden = 1
      if (await this.checkPermission()) {
        BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
        if (result.hasContent) {
          if (result.hasContent == this.orderScan.numberOfOrders) {
            this.aproveOrden = 2;
            this.orderScan.completed = true;
            this.$store.commit("scanOrder", this.orderScan);
            this.stopScan();
          } else {
            this.aproveOrden = 3;
            Vibration.vibrate(1000);
            BarcodeScanner.stopScan();
          }

        } else {
          this.aproveOrden = 1;
        }
      }
    },
    async stopScan() {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    },
    async checkPermission() {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      this.status = status;

      if (status.granted) {
        // the user granted permission
        return true;
      }

      return false;
    },
    changeRoute(val){
      this.$router.push({ name: val }).catch(() => {});
    }
  },
};
</script>

<style scoped>
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
  flex-direction: column-reverse;
  justify-content: space-between;
  margin: 0px -16px;
}
.cont {
  box-shadow: 0px 0px 5px !important;
  height: 21vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.waitScan {
  width: 10%;
}
.check {
  color: green;
}
.ban {
  color: #be1515;
}
.Error {
  box-shadow: 0px 0px 5px red !important;
  -webkit-animation: onError 1500ms backwards;
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
.Success {
  box-shadow: 0px 0px 7px green !important;
}
.allScreen {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 70vh;
  align-items: center;
}
.verifiedScreen {
  background: rgba(0, 129, 0, 0.1);
}
.errorScreen {
  background: rgba(134, 1, 1, 0.1);
}
.statusCheck{
  background: green;
  color: #fff !important;
  margin: 0px;
  padding: 10px;
  width: 100%
}
.statusError{
  background: #be1515;
  color: #fff !important;
  margin: 0px;
  padding: 5px;
  width: 100%
}
.orden-img{
  width: 70%;
}
ul{
  list-style: none;
  display: flex;

}
li{
  margin: 0px 5px;
  width: 10%;
}
</style>
