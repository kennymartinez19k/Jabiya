<template>
  <div class="container">
    <div class="stiky">
      <p
        style="font-size: 13px; font-weight: 500"
      >
         {{load?.loadNumber}}
      </p>
      <div
        class="
          uk-flex
          uk-flex
          uk-flex-center
          uk-flex-left
          uk-margin-remove
          uk-padding-remove
        "
        style="align-items: center;"
      >
        <div class="uk-flex uk-flex-wrap">
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Shipper: </span><span>&nbsp; {{ load?.shipper }}</span>
            
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span
            ><span>&nbsp; {{ load?.shipperZone }}</span>
          </p>
          
          
        </div>
        
      </div>
    </div>
    <div class="allScreen">
      
      
      <div
      class="cont uk-card uk-card-default uk-card-hover uk-card-body"
      :class="{ statusError: statusOrders == 'reject', statusCheck: statusOrders == 'approve' }"
      style="z-index: 1; padding: 15px 0px !important"
    >
      <div v-if="statusOrders == 'start'">
        <h5 style="margin: 5px 0px">
          <span v-if="orders.length <= 1">
            Escanee su Orden
          </span>
          <span v-else>
            Escanee su Orden Para Cargar
          </span>
          <img src="../assets/parcel.png" style="width: 10%">
        </h5>        
        <p v-if="orders.length <= 1" style="font-size: 14px">Verifique orden para cargar al camion</p>
        <div v-else style="font-size: 13px">
        <span class="font-weight-medium">Ordenes: </span>
        <span v-for="(orden, i) of orders" :key="orden" class="font-weight-medium">{{orden.order_num}}<span v-if="i < orders.length - 1">, </span></span>
        </div>
        
      </div>
      <div v-if="statusOrders == 'approve'" style="width: 100%; font-size: 30px">
          <img src="../assets/check.png" style="width: 35px" alt="">
          <h6 style="font-size: 14px" class="uk-margin-remove">{{completedOrder}}</h6>
        </div>
      <div v-if="statusOrders == 'reject'" style="width: 100%;; font-size: 30px">
          <h6 class="uk-margin-remove">ERROR, ORDEN NO RECONOCIDA <font-awesome-icon icon="ban" style="color: #be1515;"/>
          </h6>
      </div>
    </div>
     <div
        class="result-scan"
        :class="{checkScreen: checkOrder, banScreen: statusOrders == 'reject', finishCheck: statusOrders == 'approve'}"
      >
      <div v-if="statusOrders != 'approve' || checkOrders"></div>
      <div v-if="checkOrder">
        <div  :class="{animationCheck: checkOrder}" class="check-all-Screen"></div>
      </div>
      <div v-if="statusOrders == 'reject'">
          <font-awesome-icon icon="ban" class="ban" />
      </div>
      <div v-if="statusOrders == 'approve'" id="list-completed" style="width: 95%; padding: 15px 0px; margin: 0px 10px">
        <ul class="uk-list uk-list-divider" style="list-style: none">
          <li v-for="orden in orders" :key="orden" class="article uk-card uk-card-default uk-card-body">
              <div>
                <p><strong>No. de Orden:</strong> &nbsp;  {{orden.order_num}}</p>
                <p class="uk-width-1-1">
                Destino: &nbsp;<span>{{
                  orden.zone.name
                }}</span>
              </p>
              </div>
              <div class="uk-flex uk-flex-column completed-card">
                <img src="../assets/check.png" class="icon-checked" alt="">
                <span>Completado</span>
              </div>
          </li>
        </ul>
      </div>
        <ul class="box-orden">
          <li v-for="orden in orders" :key="orden" 
              :class="{completedOrden: orden.completed}" style="">&nbsp;</li> 
                    
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
      checkOrder: false,
      camera: "auto",
      statusOrders: 'aprovve',
      cont: 0,
      orders: [],
      load: [],
      showScanConfirmation: false,
      location1: {
        latitude: null,
        longitude: null,
      },
    };
  },
  computed: {
    ...mapGetters(["orderScan", "loadStore", "allOrders", "allLoads"]),
    completedOrder: function(){
      if(this.orders.every(x => x.completed == true)){
        return 'TODAS LAS ORDENES HAN SIDO CARGADAS'
      }
      else{
        return 'LA ORDEN HA SIDO CARGADA'
      }
    },
  },
  watch:{
    $route: function(newVal){
      if (newVal){
        this.stopScan()
      }
    }
  },
  mounted() {
    if(this.orderScan){
      BarcodeScanner.prepare();
      this.orders = this.orderScan;
      this.load = this.loadStore
    }else{ 
      this.orders = this.allOrders.filter(x => x.hour >= new Date('2020-12-02, 08:00') && x.hour <= new Date('2020-12-02, 10:00'))
      this.allLoads.forEach(el => {
        if(el.status == 'Asignada'){
          this.load = el
        }
      });
    }
    this.scanOrder();
  },

  methods: {
    async location() {
      try {
        const geo = await Geolocation.getCurrentPosition();
        this.location1.latitude = geo.coords.latitude;
        this.location1.longitude = geo.coords.longitude;
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
      this.statusOrders = 'start';
      if (await this.checkPermission()) {
        BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
        if (result.hasContent) {
          BarcodeScanner.hideBackground();
          var OrderElement = this.orders.findIndex(x => x.order_num == result.content)
          if (OrderElement > -1) {
            this.verifiedElement(OrderElement)
          } else if (OrderElement ){
            this.statusOrders = 'reject';
            Vibration.vibrate(1000);
            setTimeout(() => {
                this.statusOrders = 'start'
                this.scanOrder()
            }, 1000)
          }
        } else {
          this.statusOrders = 'start';
        }
      }
    },
    async stopScan() {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    },
    async checkPermission() {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        this.status = true;
        return true
      }
      this.status = false;
      return true
    },
    changeRoute(val){
      this.$router.push({ name: val }).catch(() => {});
    },
    
    verifiedElement(val){
        this.checkOrder = true
        this.orders[val].completed = true
        this.$store.commit("scanOrder", this.orders);
        setTimeout(() => {
          this.checkOrder = false
          if (this.orders.every(x => x.completed == true)){
          this.statusOrders = 'approve'
        } else this.scanOrder()
        }, 1000)

    }
  },
};
</script>

<style scoped>
p{
  margin: 2px 0px !important
}
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
  flex-direction: column;
}
.cont {
  box-shadow: 0px 0px 7px !important;
  width: 100%;
  height: 17vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.waitScan {
  width: 10%;
}
.check {
  color: green;
  font-size: 30px;

}
.ban {
  color: #be1515;
  font-size: 50px;

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

.allScreen {
  display: flex;
  flex-direction: column-reverse;
  height: 85vh;
  overflow: scroll;
  align-items: center;
}

.statusCheck{
  background: rgb(255, 255, 255) !important;
  box-shadow: 0px 0px 7px green !important;
  color: #fff !important;
}
.orden-img{
  width: 70%;
}
.box-orden{
  list-style: none;
  display: flex;
  padding: 0px;
  width: 100%;
  flex-wrap: wrap;
  padding: 0px 20px;
  margin-bottom: 10px !important
}
.box-orden li{
    width: 25px;
    border: 1px solid #a2a2a2;
    margin: 1px
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
  box-shadow: 1px 0px 5px #898989;
}
.info-header {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.status {
  color: green;
  font-weight: 500;
  font-size: 12px;
}
.icon-load {
  width: 35%;
  margin-right: 20px;
}


/* Here... */
.check-all-Screen {
  position: fixed;
    left: calc(70% - 30px);
    top: calc(54% + 30px);
    border: solid 17px green;
    width: 109px;
    height: 59px;
    margin: -50px 0 0 -100px;
    border-top: none;
    border-right: none;
    transform: rotate(-45deg);
    transform-origin: top left;
    box-shadow: -5px 5px 0 0 rgb(3 148 10 / 14%);
    
}

.animationCheck {
  animation: start 1s ease infinite both;
  /* Override default play state paused of codepen iframe */
  animation-play-state: running!important;
}

@keyframes start {
  0% {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  50% {
    opacity: 1;
    width: 0;
    height: 59px;
  }
  100% {
    width: 120px;
  }
}
.checkScreen{
  background: rgba(11, 134, 0, 0.1)
}
.banScreen{
   background: rgba(255, 138, 138, 0.1) !important;
}
.finishCheck{
  background: #fff;
  flex-direction: column-reverse
}
.article{
 text-align: initial;
 display: flex;
 justify-content: space-between;
 align-items: flex-start;
 padding: 12px;
 font-weight: 500;
 width: 100%;
 background: #fefffe;
 color: rgb(0, 0, 0);
 box-shadow: 0px 1.2px 1px #ccc;
 border-radius: 5px;
border: 1px solid #efefef;
}
.uk-card-body::before{
  content: none;
}
.completedOrden{
  background: green;
}
.icon-checked{
  width: 20px;
}
.completed-card{
  height: 43px;
  border-left: 1px solid #ccc;
  padding-left: 20px;
  align-items: center;
}
.result-scan{
  width: 100%;
  height: 68vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
