<template>
  <div>
      <button class="uk-button" @click="scan">scan</button>
      <p>{{result}}</p>
      <button @click="this.checkPermission">permiso</button>
      <p>{{this.checkPermission}}</p>
  </div>
</template>

<script>
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export default {

  data () {
    return {
      camera: 'auto',
      result: null,
      showScanConfirmation: false
    }
  },

  methods: {
    async scan() {
        if(await this.checkPermission()){
          BarcodeScanner.hideBackground(); // make background of WebView transparent
  
          const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

          if (result.hasContent) {
              this.result = result.content
              this.stopScan() // log the raw scanned content
          }
        }

        // if the result has content
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
    },
    async onInit (promise) {
      try {
        await promise
      } catch (e) {
        console.error(e)
      } finally {
        this.showScanConfirmation = this.camera === "off"
      }
    },

    async onDecode (content) {
      this.result = content

      this.pause()
      await this.timeout(500)
      this.unpause()
    },

    unpause () {
      this.camera = 'auto'
    },

    pause () {
      this.camera = 'off'
    },

    timeout (ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
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