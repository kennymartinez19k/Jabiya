<template>
  <div class="uk-container">
      <div>
          <div class="uk-card uk-card-default uk-card-hover uk-card-body" style="z-index: 0; padding: 15px 0px !important">
            <h6 class="">Entrega de Orden No. {{loadStore.numberOfOrden}}</h6>
            <h6 class="exception">Hubo Alguna Excepcion? No
              <div class="onoffswitch">
    <input type="checkbox" v-model="exception" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" tabindex="0">
    <label class="onoffswitch-label" for="myonoffswitch"></label>
              </div>
              Si
            </h6>
            <h4 class="">Acciones</h4>
              <timeline :step="step" :exception="exception"/>
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
        step: 0,
        exception: false
      }
    },
    computed: {
    ...mapGetters([
      "orderScan",
      "loadStore"
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
.onoffswitch {
    position: relative; width: 73px;
    display: inline-block;
    width: 45px;
    margin: 0px 5px;
    -webkit-user-select:none; -moz-user-select:none; -ms-user-select: none;
}
.onoffswitch-checkbox {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}
.onoffswitch-label {
  position: relative;
  top: 3px;
    display: block; overflow: hidden; cursor: pointer;
    height: 22px; padding: 0; line-height: 36px;
    border: 2px solid #E3E3E3; border-radius: 36px;
    background-color: #FFFFFF;
    transition: background-color 0.3s ease-in;
}
.onoffswitch-label:before {
    content: "";
    display: block; width: 20px; margin: 0px;
    background: #FFFFFF;
    position: absolute; top: 0; bottom: 0;
    right: 19px;
    border: 2px solid #E3E3E3; border-radius: 36px;
    transition: all 0.3s ease-in 0s; 
}
.onoffswitch-checkbox:checked + .onoffswitch-label {
    background-color: #02CF13;
}
.onoffswitch-checkbox:checked + .onoffswitch-label, .onoffswitch-checkbox:checked + .onoffswitch-label:before {
   border-color: #02CF13;
}
.onoffswitch-checkbox:checked + .onoffswitch-label:before {
    right: 0px; 
}
.exception{
  display: flex;
    align-items: center;
    justify-content: center;
}
</style>