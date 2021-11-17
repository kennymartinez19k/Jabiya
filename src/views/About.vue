<template>
  <div>
      <button class="uk-button" @click="scan">scan</button>
      <button class="uk-button" @click="location">location</button>
      <h1>{{location1}} wer</h1>
      <p>{{result}}</p>
  </div>
</template>

<script>
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import {mapGetters} from 'vuex'
import { Geolocation } from '@capacitor/geolocation';


export default {

  data () {
    return {
      camera: 'auto',
      result: null,
      showScanConfirmation: false,
      location1: {
        latitude: null,
        longitude: null,
      }
    }
  },
  computed:{
    ...mapGetters([
      'orderScan'
    ])
  },
  mounted(){
    if(this.orderScan) {
      console.log(this.orderScan)
      this.scanOrder()
    }
  },

methods: {
      async location () {
        try {
          const geo = await Geolocation.getCurrentPosition();
          this.location1.latitude = geo.coords.latitude
          this.location1.longitude = geo.coords.longitude
            console.log('Current position:', this.location1);
        } catch (e) {
          if (e.code === 1 || e.message === "location disabled") {
            alert("Debe activar la localización.")
          } else {
            alert("Error inesperado. Favor contactese con el Administrador.")
          }
          console.log(e)
        }
    }, 

    async scan() {
        if(await this.checkPermission()){
          BarcodeScanner.hideBackground(); 
  
          const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

          if (result.hasContent) {
              this.result = result.content
              this.stopScan()
          }
        }
    },
    async stopScan(){
        BarcodeScanner.showBackground();
        BarcodeScanner.stopScan();
    },
    async checkPermission() {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (status.granted) {
        // the user granted permission
        return true;
      }

      return false;
    }
  }

}
</script>

<style scoped>
.scan-confirmation {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, .8);

  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
</style>