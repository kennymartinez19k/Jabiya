<template>
  <div>
      <button class="uk-button" @click="scan">scan</button>
      <p>{{result}}</p>
  </div>
</template>

<script>
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import {mapGetters} from 'vuex'

export default {

  data () {
    return {
      camera: 'auto',
      result: null,
      showScanConfirmation: false
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
    //     async location () {
    //     alert('papaeeeeeeeeeeeeeeeep')
    //     try {
    //       const geo = await Geolocation.getCurrentPosition();
    //       this.location1.latitude = geo.coords.latitude
    //       this.location1.longitude = geo.coords.longitude
    //       // this.successCallback ( this.location1)
    //         console.log('Current position:', this.location1);
    //     } catch (e) {
    //       console.log('Current position:', this.location1);
    //       alert('papap' + e.toString() + ' ' + e.message)
    //       alert('papap' + this.location1?.timestamp)
    //     }
    // }, 
    async scanOrder() {
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