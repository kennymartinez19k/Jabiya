<template>
  <div class="uk-flex uk-flex-column uk-flex-between cnt">
         <div class="uk-flex stiky uk-flex-around uk-margin-remove uk-padding-remove">
          <span class="truckSpan">
            <img src="../assets/img/truck.png" class="truck" alt="Camion">
          </span>
            <div class="uk-text-left uk-fle-middle">
            
          </div>
        </div>
        <div class="uk-card uk-card-default uk-width-1-2@m uk-margin-medium-bottom">
            <div
              v-for="order in orders"
              :key="order"
              class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
            >
              <div class="uk-text-left info-user uk-flex uk-flex-wrap">
                  <div class="btn uk-flex">
                      
                      <div class="uk-flex uk-flex-column uk-text-center">
                        <p style="font-size: 16px !important; font-weight: 600" class="uk-width-1-1"><span>{{order.client}}</span></p>
                      </div>
                      <span>
                        <img src="../assets/package.png" alt="">
                      </span>
                  </div>
                    <p class="uk-width-1-1"><strong>Direccion: </strong><span>{{order.address}}</span></p>
                    <p class="uk-width-1-2"><strong> No. de Orden: </strong><span>{{order.numberOfOrders}}</span></p>
                    <p class="uk-width-1-2"><strong>No. de Cajas: </strong>{{order.numberOfBox}}<span></span></p>
                  <!-- <div class="uk-width-1-2 uk-flex uk-flex-between">
                    <button class="uk-button uk-button-transparent"><font-awesome-icon icon="qrcode"/> Escanear</button>
                </div> -->
                <div class="uk-flex uk-width-1-1 uk-flex-between" style="margin-top: 10px">
                  <div class="uk-flex uk-flex-column uk-width-1-2" >
                    <img src="../assets/map.png" class="img-scan" alt="">
                    <span>Ver Ruta</span>
                  </div>
                  <div class="uk-flex uk-flex-column uk-width-1-2">
                    <img src="../assets/parcel.png" class="img-scan" style="margin: 0px 20px" alt="">
                      <span>Escanear Orden</span>
                  </div>
                </div>

                    <!-- <button class="uk-button uk-button-default uk-width-1-1 btn-scan" style="margin-top: 10px">
                      
                      <div>
                        <img src="../assets/parcel.png" class="img-scan" alt="">
                        <span></span>

                      </div>
                        
                    </button> -->
                    
              </div>
            </div>
         </div>
    
        <slide-unlock
        ref="vueslideunlock"
        :auto-width="true"
        :circle="true"
        :disabled="false"
        :noanimate="false"
        :width="400"
        :height="40"
        :completedBg="completed"
        class="slide"
        text="Escaneo Corrido"
        success-text="success"
        @completed="complete(orders)"
        textSize="10px"
    />
  </div>
</template>

<script>
import {} from '../assets/img/truk1.png'
import SlideUnlock from "vue-slide-unlock"
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { mapGetters } from 'vuex';
export default {
    data(){
        return{
            result: null,
            load: null,
            completed: 'background-color: #2a307c !important',
            orders:[
                {
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'Juan Martinez Soto',
                    address: 'Sto Dgo Este, Alma Rosa 2da calle abreu #17',
                    timeToWait: '2020-01-23'
                },{
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'Maria Lisbeth Alcantara Rodriguez',
                    address: 'Sto Dgo Este, Alma Rosa 2da calle abreu #17' ,
                    timeToWait: '2020-01-23'
                },
                {
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'Albert Perez',
                    address: 'Sto Dgo Este, Alma Rosa 2da calle abreu #17' ,
                    timeToWait: '2020-01-23'
                },{
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'Jose Abreu Pichardo',
                    address: 'Sto Dgo Este, Alma Rosa 2da calle abreu #17' ,
                    timeToWait: '2020-01-23'
                },{
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'Juan Jose Garcia',
                    address: 'Sto Dgo Este, Alma Rosa 2da calle abreu #17' ,
                    timeToWait: '2020-01-23'
                },

    
                
            ]
        }
    },
    components: {
        SlideUnlock,
    },
    computed: {
     ...mapGetters([
       'loadStore'
     ])
    },
     mounted(){
        this.$store.commit('setCurrent', {menuName: 'Lista de ordenes',componentName: 'orders'},)
        this.load = this.loadStore
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
    complete(val){
      this.scan(val)
    },
    scan(val){
        this.$store.commit('scanOrder', val )
        this.$router.push({ name: 'about' }).catch(() => {})
    },
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

.slide .slideunlock.is-complete .slideunlock-progressbar {
    background-color: #2a307c;
}
.slide:first-child{
    background-color: #2a307c;
}
.cnt {
  height: 100%;
  overflow: scroll;
}
.uk-card{
  padding: 20px 10px;
}
.uk-card-body{
  margin-bottom: 10px;
  align-items: center;
  padding: 16px 15px;
}
.slide{
    position: fixed;
    width: 97% !important;
    bottom: 5px;
    height: 40px;
}

.btn{
    display: flex;
    align-items: baseline;
    width: 100%;
}
.btn img{
  width: 20px;
    position: relative;
    top: -2px;
  margin-left: 3px;
}

.scan-code img{
      width: 28px;
    position: relative;
    top: -2px;
    left: 4px;
}

.truckSpan {
  max-width: 100%;
  width: 32%;
}
.truck {
  max-width: 100%;
  transform: scaleX(-1);
  width: 70px;
  display: flex;
}
.stiky {
    position: sticky;
    top: 0px;
    z-index: 2;

    background-color: rgb(244, 247, 250);
}

.img-scan{
      width: 39px
}
.btn-scan{
  margin-top: 12px;
box-shadow: 0px -0.5px 3px #000;
    border: 0px;
    color: #fff;
    padding: 3px;
  background: #2a307c;
}

</style>