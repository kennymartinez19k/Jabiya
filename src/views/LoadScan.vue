<template>
  <div class="stiky">
      <div
        class="
          uk-flex
          uk-flex
          uk-flex-between
          uk-flex-left
          uk-margin-remove
          uk-padding-remove
        "
        style="align-items: center"
      >
        <div style="font-size: 13px; font-weight: 500">
          <p class="uk-width-1-1 uk-flex">
            <strong>Shipper:</strong><span>&nbsp; {{ loads?.client }}</span>
          </p>
          <p class="uk-width-1-1 uk-flex">
            <strong>Zona de Destino:</strong
            ><span>&nbsp; {{ loads?.zone }}</span>
          </p>
        </div>
        <div class="info-header">
          <span class="status">Carga {{ loads?.status }}</span>
          <img
            v-if="loads?.status == 'Asignada'"
            src="../assets/asigned.png"
            class="icon-load"
          />
          <img
            v-if="loads?.status == 'Entregada'"
            src="../assets/delivery.png"
            class="icon-load"
          />
          <img
            v-if="loads?.status == 'En Ruta'"
            src="../assets/road.png"
            class="icon-load"
          />
          <img
            v-if="loads?.status == 'Despacho Aprobado'"
            src="../assets/warehouse.png"
            class="icon-load"
          />
        </div>
      </div>
    </div>
  <div class="container">
    <div
      class="cont uk-card uk-card-default uk-card-hover uk-card-body"
      :class="{ statusError: statusOrders == 'reject', statusCheck: statusOrders == 'approve' }"
      style="z-index: 1; padding: 15px 0px !important"
    >
      <div v-if="statusOrders == 'start'">
        <h5 style="margin: 5px 0px">
          Escanee su Orden
          <img src="../assets/parcel.png" style="width: 10%">
        </h5>        
        <p style="font-size: 14px">Verifique su orden para cargarla al camion</p>
        
      </div>
      <div v-if="statusOrders == 'approve'" style="width: 100%; font-size: 30px">
          <font-awesome-icon icon="check-circle" class="check" />
          <h6 style="font-size: 14px" class="uk-margin-remove">{{completedOrder}}</h6>
        </div>
      <div v-if="statusOrders == 'reject'" style="width: 100%;; font-size: 30px">
          <h6 class="uk-margin-remove">ERROR, ORDEN NO RECONOCIDA <font-awesome-icon icon="ban" style="color: #be1515;"/>
          </h6>
      </div>
    </div>
    <div>
      <div
        class="allScreen"
        :class="{checkScreen: checkOrder, banScreen: statusOrders == 'reject', finishCheck: statusOrders == 'approve'}"
      >
      <div></div>
      <div v-if="checkOrder">
        <div  :class="{animationCheck: checkOrder}" class="check-all-Screen"></div>
      </div>
      <div v-if="statusOrders == 'reject'">
          <font-awesome-icon icon="ban" class="ban" />
      </div>
      <div v-if="statusOrders == 'approve'" id="list-completed" style="width: 95%; padding: 20px">
        <ul class="uk-list uk-list-divider" style="list-style: none">
          <li v-for="orden in orders" :key="orden" class="article uk-card uk-card-default uk-card-body">
              <div>
                <p class="uk-width-1-1" style="font-weight: 600">
                <font-awesome-icon icon="map-marker-alt" style="font-size: 14px; color: green" />&nbsp;<strong>{{
                  orden.address
                }}</strong>
              </p>
              <strong>No. de Orden: &nbsp; {{orden.numberOfOrders}}</strong>
              </div>
              <div class="uk-flex uk-flex-column" style="align-items: center">
                <font-awesome-icon icon="check-circle" style="font-size: 20px; color: green"/>
                <span style="color: green; font-weight: 500">Cargada</span>
              </div>
          </li>
        </ul>
      </div>
        <ul class="box-orden" v-if="statusOrders !== 'approve'">
          <li v-for="orden in orders" :key="orden" 
              :class="{completedOrden: orden.completed}" style="">&nbsp;</li>
              <li v-for="orden in orders" :key="orden" 
              :class="{completedOrden: orden.completed}" style="">&nbsp;</li>
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
  alias: 'ILS 11/23/2021 1:30PM Gate 01',
  data() {
    return {
      checkOrder: false,
      camera: "auto",
      statusOrders: 'start',
      cont: 0,
      orders: [],
      loads: [],
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
    }
  },
  mounted() {
    if(this.orderScan){
      this.orders = this.orderScan;
      this.loads = this.loadStore
    }else{
      this.orders = this.allOrders.filter(x => x.hour >= new Date('2020-12-02, 08:00') && x.hour <= new Date('2020-12-02, 10:00'))
      this.allLoads.forEach(el => {
        if(el.status == 'Asignada'){
          this.loads = el
          console.log(this.loads)
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
      this.statusOrders = 'start';
      if (await this.checkPermission()) {
        BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
        if (result.hasContent) {
          BarcodeScanner.hideBackground();
          var OrderElement = this.orders.findIndex(x => x.numberOfOrders == result.content)
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
      this.status = status;
      if (status.granted) {
        return true;
      }
      return false;
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
  flex-direction: column-reverse;
  justify-content: space-between;
  margin: 0px -16px;
}
.cont {
  box-shadow: 0px 0px 7px !important;
  height: 19vh;
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
  justify-content: space-between;
  flex-direction: column;
  height: 62vh;
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
  width: 80%;
  flex-wrap: wrap;
  margin: 15px 0px
}
.box-orden li{
    width: 25px;
    border: 1px solid #a2a2a2;
    margin: 1px
}
.stiky {
  color: #000 !important;
  top: 0px;
  z-index: 2;
  padding: 5px 10px !important;
  background-color: rgb(248 248 248);
  border-bottom: 1px solid #ccc;
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
 width: 100%;
 background: #fefffe;
 color: rgb(0, 0, 0);
 box-shadow: 0px 1.2px 1px #ccc;
 border-radius: 10px;
border: 1px solid #efefef;
}
.uk-card-body::before{
  content: none;
}
.completedOrden{
  background: green;
}
</style>
