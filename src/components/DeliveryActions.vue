<template>
  <div class="uk-container">
      <div>
          <div class="uk-card uk-card-default uk-card-hover uk-card-body" style="z-index: 0; padding: 15px 0px !important">
            <h3 class="uk-card-title">Acciones</h3>
              <timeline :step="step" @action="getShow($event)"/>
            <button class="uk-button uk-button-primary uk-margin" @click="step++">Siguiente</button>
           </div> 
      </div>
      <div v-if="show" class="uk-flex">
        <h1 >{{result}}</h1>
        <h1>
          <div class="uk-width-1">
             <img v-for="src in imagiElement" :key="src"  class="uk-padding" style="max-width: 30%" :src="src" alt="">
          </div>
        </h1>
        <h1 >Firma</h1>
      </div>
  </div>
</template>

<script>
import { BarcodeScanner } from "@capacitor-community/barcode-scanner"
import { mapGetters } from "vuex"
import timeline from '../components/timeline.vue'
import { Camera, CameraResultType } from '@capacitor/camera'
// import {} from '../assets/img/cam.png'
export default {
    name: 'DeliveryActions',
     components: {
        timeline
    },
    data () {
      return{
        show: null,
        orders: null,
        result: null,
        cont: null,
        imagiElement: [],
        step: 0
      }
    },
    computed: {
    ...mapGetters([
      "orderScan",
    ]),
  },
  mounted() {
    this.orders = this.orderScan
    
  },

    methods: {
      getShow(value) {
        this.show = value
        // this.step++
        if (value === 'scan') {
          this.scanOrder(this.orders)
        } else if (value === 'camera' && this.imagiElement.length <= 6) {
          this.getCam()
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

        if (status.granted) {
          // the user granted permission
          return true;
        }

        return false;
      },

      async getCam () {
        this.cont = this.cont + 1;
           this.getCheckPermissions()
        let imagi = []
          imagi.push(await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            limit: 3,
            resultType: CameraResultType.Uri
         }))
         
          var imageUrl = imagi[0].webPath;
          this.imagiElement[this.cont] = imageUrl;
          console.log(imagi, 'imagi.webPath')
        if (imagi === 1) {
        // this.getPickImages()
        }          
    
          
      },

      async getPickImages () {
         let imagi = []
         imagi.push(await Camera.pickImages({
             quality: 90,
            allowEditing: true,
            correctOrientation: true,
            width: '25%',
            limit: null,
            resultType: CameraResultType.Uri
           }))
      },

      async getCheckPermissions() {
        const permissions = Camera.checkPermissions('prompt-with-rationale')
        console.log(permissions, 'ddddddddddppppp')
        this.getRequestPermissions()
      },

      async getRequestPermissions() {
        try {
         const permissions1 = Camera.requestPermissions({permissions:['camera' | 'photos']})
         console.log(permissions1, 'ddddddddddppppp')
        } catch (error) {
          console.log(error, 'aaaaaaaaaaaa')
        }
      
      }

    }
}
</script>

<style>
.qr {
    width: 60%; 
}
.circle {
 background-color: rgb(25, 189, 33);
}
</style>