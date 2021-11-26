<template>
  <div>
      <button class="uk-button" @click="scanOrder">scan</button>
      <button class="uk-button" @click="location">location</button>
      <button class="uk-button" @click="result = true">location</button>

      <h1>{{location1}}</h1>
      <p>{{result}}</p>
  </div>
</template>

<script>
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { mapGetters } from "vuex";
import { Geolocation } from "@capacitor/geolocation";

export default {
  data() {
    return {
      camera: "auto",
      result: null,
      status: null,
      orders: [],
      showScanConfirmation: false,
      location1: {
        latitude: null,
        longitude: null,
      },
    };
  },
  watch:{
    result: function(newVal){
      if (newVal == true){
        this.orderScan.completed = true
        this.$store.commit("scanOrder", this.orderScan);
        this.$router.push({ name: "orders" }).catch(() => {});

      }
    }
  },
  computed: {
    ...mapGetters(["orderScan"]),
  },
  mounted() {
    this.orders = this.orderScan
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
      
      if (await this.checkPermission()) {
        BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

        if (result.hasContent) {
          this.result = result.content;
          this.stopScan();
          
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
      this.status = status

      if (status.granted) {
        // the user granted permission
        return true;
      }

      return false;
    },
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


/* 
body {
  margin:0;
  background-color:#191919;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:Helvetica,Sans-serif;
} */




</style>
