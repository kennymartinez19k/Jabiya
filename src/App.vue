<template>
  <div class="uk-flex app">
    <side-bar v-if="!hideSideBar" class="sideBar"/>
    <div class="container-app">
      <app-header class="header" v-if="!currentPage" :nameComponent="currentName"/>
      <router-view class="view-header" @setNameHeader="setName($event)" :class="{view: !currentPage}"/>
    </div>
  </div>
</template>
<script>
import AppHeader from './views/AppHeader.vue'
import {queue, remove} from './queue'
import {LocalStorage} from './mixins/LocalStorage'
import { Profile } from './mixins/Profile'
import { Storage} from '@ionic/storage'
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { Geolocation } from "@capacitor/geolocation";
import sideBar from './components/sideBar.vue'

export default {
  data(){
    return{
      noHead: [
        'sign-in',
        'sign-up',
        'recover-password'
      ],
      nameOrder: null,
      localStorage: new Storage(),
      localStorageGps: new Storage(),
      isServerUp: true,
      connection: null,
      proofQueue: [],
      intervalForGps: 0,
      step: 0,
      lastLocation: {
        latitude: 0,
        longitude: 0
      },
      hasUbicationServer: false,
      hideSideBar: true
    }
  },
 
  watch:{
    $route: function(newVal){
      this.hideSideBar = (newVal.name == 'sign-in' || newVal.name == 'redirect')
      if(newVal.name !== 'scan-order' || newVal.name !== 'deliveryActions'){
          this.stopScan()
      }
    }
  },
  components:{
    AppHeader,
    sideBar
  },
  mixins: [LocalStorage, Profile],
  computed:{
    currentPage: function() {
      return this.noHead.some(x => x == this.$route.name)
    },
    currentName: function() {
      if(!this.currentPage){
        var Route = this.$route.matched[0]?.components?.default?.alias
        if(Route) return Route
        else return this.nameOrder
      }
      return ''
    },
    
  },
  async mounted(){
    this.localStorageGps.create()

      this.setUrl()
      this.getInfo()
    
      this.localStorage.set('sending' , "false")
      this.localStorage.set('serverUp' , "true")
      let delay = ms => new Promise(res => setTimeout(res, ms));
      
      let condition = true
      const intervalLimit = 5

      while (condition) {
        let user = JSON.parse(localStorage.getItem("userInfo"));
        await delay(2000);

        this.intervalForGps += 1

        let load = JSON.parse(localStorage.getItem('DeliveryCharges'))
        if(this.intervalForGps > intervalLimit && ( localStorage.getItem(`gps ${load?.loadMapId}`) || JSON.parse(localStorage.getItem('gpsProvider'))) ){
          this.intervalForGps = 0
            
            this.location(load).then((locationUpdate) => {
              if(location){
                let location = {...locationUpdate};
                if (
                  Math.abs(location?.latitude - this.lastLocation?.latitude) >
                    0.00003 ||
                  Math.abs(location?.longitude - this.lastLocation?.longitude) >
                    0.00003
                ) {
                    this.lastLocation.latitude =  location?.latitude
                    this.lastLocation.longitude = location?.longitude
                    this.$services.gpsServices.updateLocation(
                      user.id,
                      location?.latitude,
                      location?.longitude,
                      load?.bay_id?._id
                    );
                }
              }
            });
          
      
        }
        if(queue.length > 0){
          let enqueueItem = remove()
          localStorage.removeItem("queueIsEmpty")
          await this.enqueue(enqueueItem)
        }else{
          localStorage.removeItem('allOrderScanned')
          localStorage.setItem("queueIsEmpty", JSON.stringify(true))
        }
        this.isServerUp = await this.localStorage.get('serverUp')
        let isConnected 

        try{
          isConnected = await this.$services.loadsServices.serverStatus()
        }catch(error){
          isConnected = false
        }
        if(!(JSON.parse(this.isServerUp)) || !isConnected){
          if(isConnected) {
            this.localStorage.set('serverUp' , "true")
            this.$store.commit('setServer', true)
          }
          else this.$store.commit('setServer', false)
        }else{
          this.$store.commit('setServer', true)
          this.localStorage.set('serverUp' , "true")
          let queueItem = await this.peek()
          if(queueItem){
            this.$store.commit('changeQueueStatus', false)
            try{
              let res = await this.$services.requestServices.request(queueItem)
              if(res){
                this.dequeue()
              }
              await this.localStorage.set('serverUp' , JSON.stringify(true))
              this.$store.commit('setServer', true)
            } 
            catch(error){
              if(error.message != 'Network Error'){
                this.$store.commit('changeRequestStatus', true)
                this.dequeue()
              }
              await this.localStorage.set('serverUp' , JSON.stringify(false))
              this.$store.commit('setServer', false)
            }
          }else{
            this.$store.commit('changeQueueStatus', true)
          }
      }
    }
  },
  methods:{
    setName(val){
      this.nameOrder = val
    },
    async setUrl(){
      let setting = await JSON.parse(localStorage.getItem('setting'))
      this.$services.singInServices.setURL(setting)
      this.$services.loadsServices.setURL(setting) 
      this.$services.loadsScanServices.setURL(setting)
      this.$services.invoicesSevices.setURL(setting)
      this.$services.deliverServices.setURL(setting)
      this.$services.gpsServices.setURL(setting)
      this.$services.driverVehicleAssignment.setURL(setting)
      this.$services.exceptionServices.setURL(setting)
      this.$services.manageOrders.setURL(setting)

    },
    async stopScan() {
      try{
        BarcodeScanner.showBackground();
        BarcodeScanner.stopScan();
      }catch(error){
        //  console.clear()

      }
    },
    getInfo(){
      let setting = JSON.parse(localStorage.getItem('setting'))
      this.$store.commit("setSettings",setting);
    },
  
    async location(load){
    if(!load?.Vehicles[0]?.gpsProvider || load?.Vehicles[0]?.gpsProvider == 'Flai Mobile App'){
      try{
        let result = await Geolocation.getCurrentPosition()
        return {latitude: result.coords.latitude, longitude: result.coords.longitude}
      }catch(error){
        console.log(error)
      }
    }else{
      // let result = await this.$services.gpsProviderServices.getVehicleGpsId(load.Vehicles[0].gpsId)
      // return {latitude: result.lat, longitude: result.lng}
      return false
    }
    }
  }
}
</script>
<style>
.app{
  height: 100%;
}
.container-app{
  width: 100%;
  height: 100%;
  position: relative;
}

#app {
  font-size: 12px;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  font-size: 12px;
}
p {
  margin: 4px 0px;
}
h5{
   color: #5c5c5c !important
}
.uk-text-gray{
  color: #666666;
}

.uk-button-purple{
  background: #2a307c;

  color: #fff;
}
.uk-button-transparent{
  color: #1f1f1f;
    background: white;
    border: 1px solid;
}
button{
  border-radius: 5px !important
}
.uk-button-red{
  background: #930404;
  color: #fff
}
.uk-button-orange{
  background: #bf6121;
  color: #fff;
}
.view{
  height: 92vh !important;
}
.view-header{
  
  height: 92%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}
html body{
  height: 100vh;
  padding: 0;
  margin: 0;

}
strong{
  font-size: 13px !important;
  font-weight: 600 !important;
}
.btn-button{
  font-size: 10px !important
}
#nav {
  padding: 10px;

}
.font-weight-medium{
  font-weight: 500 !important;
}
.cnt {
  height: 92% !important;
}
.uk-button-transparent{
  color: #1f1f1f;
    background: white;
    border: 1px solid;
    border: 1px solid #4a4a4a;
}
.uk-button{
  line-height: 15px;
  font-size: 10px;
  padding: 10px 10px;
}

:focus:not([tabindex^='-']) {
    outline: 0px dotted #333;
    outline-offset: 1px;
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
.uk-button-green{
  background: green;
  color: #fff
}
.uk-button-blue{
  background: #0f7ae5;
  color: #fff
}
.text-bold{
  font-size: 14px;
  color: #5c5c5c ;
}
.sideBar{
  width: 20%;
  max-width: 245px;
  border-right: 0.5px solid #CCC;
}
.header{
  height: 8%;
}

@media (min-width: 1050px){
  .web-font-small{
    font-size: 16px !important;
  }
   .web-font-medium{
    font-size: 20px !important;
  }
}
@media (max-width: 900px){
  .sideBar{
    display: none;
  }
 
}


</style>
