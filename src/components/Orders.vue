<template>
  <div class="uk-flex uk-flex-column uk-flex-between cnt">
       <div class="uk-flex load">
              <img src="../assets/img/truk1.png" alt="Truk" class="truk" >
              <div class="uk-text-left">
                    <p><strong> Estado: </strong><span>{{load?.status}}</span></p>
                    <p><strong>Cliente: </strong> <span>{{load?.client}}</span></p>
                    <p><strong>No. de load(es): </strong>{{load?.numberOfOrden}}<span>2</span></p>
                    <p><strong>Zona: </strong><span>{{load?.zone}}</span></p>
                    <button class="uk-button-transparent " style="padding: 5px 15px;">Ver Rutas</button>
              </div> 
          </div>
      <div class="uk-card uk-card-default uk-margin-remove uk-width-1-2@m container">
        <div class="uk-margin-large-bottom">
            <div
            v-for="order in orders"
            :key="order"
            class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
            >
            <div class="uk-text-left info-user" style="width: 60%">
                <p><strong>Cliente: </strong> <span>{{order.client}}</span></p>
                <p><strong> No. de Orden: </strong><span>{{order.numberOfOrders}}</span></p>
                <p><strong>No. de Cajas: </strong>{{order.numberOfBox}}<span></span></p>
                <p><strong>Direccion: </strong><span>{{order.address}}</span></p>
                <div><strong>{{order.timeToWait}}</strong></div>
            </div>
            <div class="btn">
                <img src="../assets/img/box.jpeg" alt="Box" class="box" >
                <div>
                    <button class="uk-button uk-button-transparent btn-button" @click="scan(order)" style="padding: 0px 15px">Escanear</button>
                </div>
            </div>
              <font-awesome-icon class=""  icon="circle" />
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
// import {} from '../assets/img/truk1.png'
import { mapGetters } from 'vuex'
import SlideUnlock from "vue-slide-unlock"
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
export default {
       components: {
        SlideUnlock,
    },
    data(){
        return{
            result: null,
            completed: 'background-color: #2a307c !important',
            load: null,
            orders:[
                {
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'Juan Martinez',
                    address: 'Republica de colombia',
                    timeToWait: '2020-01-23'
                },{
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'juan',
                    address: 'Rep Dom',
                    timeToWait: '2020-01-23'
                },
                {
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'juan',
                    address: 'Rep Dom',
                    timeToWait: '2020-01-23'
                },{
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'juan',
                    address: 'Rep Dom',
                    timeToWait: '2020-01-23'
                },{
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'juan',
                    address: 'Rep Dom',
                    timeToWait: '2020-01-23'
                },

    
                
            ]
        }
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
  box-shadow: 0px 0.5px 1.2px;
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
.load {
     position:sticky;
    top: -1px;
    z-index: 2;
    margin: 0px;
    padding: 0px;
    background-color: rgb(252, 249, 249);
}
.btn{
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.box {
 width: 58px;
 margin: 0px 8px 8px;
}
.truk {
    width: 48%;
    margin: 0px 8px 8px;
    display: flex;
    flex-direction: initial;
    transform: scaleX(-1);
}
.uk-button-transparent:hover {
 background-color: darkgray;
}
</style>