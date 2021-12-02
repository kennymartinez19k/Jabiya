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
            <strong>Shipper:</strong><span>&nbsp; {{ loadStore?.client }}</span>
          </p>
          <p class="uk-width-1-1 uk-flex">
            <strong>Zona de Destino:</strong
            ><span>&nbsp; {{ loadStore?.zone }}</span>
          </p>
        </div>
        <div class="info-header">
          <span class="status">Carga {{ loadStore?.status }}</span>
          <img
            v-if="loadStore?.status == 'Asignada'"
            src="../assets/truckGreen.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="loadStore?.status == 'Entregada'"
            src="../assets/truckDefault.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="loadStore?.status == 'En Ruta'"
            src="../assets/truckBlue.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="loadStore?.status == 'Despacho Aprobado'"
            src="../assets/truckOrange.png"
            class="icon-load"
            alt=""
          />
        </div>
      </div>
    </div>
  <div class="container">
    <div
      class="cont uk-card uk-card-default uk-card-hover uk-card-body"
      :class="{ statusError: aproveOrden == 3, statusCheck: aproveOrden == 2 }"
      style="z-index: 0; padding: 15px 0px !important"
    >
      <div v-if="aproveOrden == 1">
        <h4>
          Escanee su Orden
          <img src="../assets/parcel.png" style="width: 10%">
        </h4>        
        <p style="font-size: 14px">Verifique su orden para cargarla al camion</p>
        
      </div>
      <div v-if="aproveOrden == 2" style="width: 100%; font-size: 30px">
          <font-awesome-icon icon="check-circle" class="check" />
          <h6 class="uk-margin-remove">TODAS LAS ORDENES HAN SIDO CARGADAS</h6>
        </div>
      <div v-if="aproveOrden == 3" style="width: 100%;; font-size: 30px">
          <font-awesome-icon icon="ban" class="ban" />
          <h6 class="uk-margin-remove">ERROR, ORDEN NO RECONOCIDA
          </h6>
      </div>
    </div>
    <div>
      <div
        class="allScreen"
        :class="{checkScreen: checkOrder, banScreen: aproveOrden == 3, finishCheck: aproveOrden == 2}"
      >
      <div></div>
      <div v-if="checkOrder">
        <div  :class="{animationCheck: checkOrder}" class="check-all-Screen"></div>
      </div>
      <div v-if="aproveOrden == 3">
          <font-awesome-icon icon="ban" class="ban" />
      </div>
      <div v-if="aproveOrden == 2" style="width: 95%; padding: 20px">
        <ul class="uk-list uk-list-divider">
          <li v-for="orden in orders" :key="orden" class="uk-text-left uk-flex uk-flex-between">
            <div>
              <div>
                <strong>Orden: &nbsp;</strong>{{orden.numberOfOrders}} 
               
              </div>
              <span><strong>Cliente: &nbsp;</strong> {{orden.client}}</span>
            </div>
            
            
          </li>
        </ul>
      </div>
        <ul class="box-orden" v-if="aproveOrden !== 2">
          <li v-for="orden in orders" :key="orden">
            <img v-if="!orden.completed" src="../assets/package-unloaded.png" srcset="">
            <img v-if="orden.completed" src="../assets/package-loaded.png">
          </li>
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
      aproveOrden: 1,
      cont: 0,
      orders: [],
      showScanConfirmation: false,
      location1: {
        latitude: null,
        longitude: null,
      },
    };
  },
  computed: {
    ...mapGetters(["orderScan", "loadStore"]),
  },
  watch:{
    aproveOrden: function(newVal){
      alert(newVal)
    }
  },
  mounted() {
    this.orders = this.orderScan;
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
      this.aproveOrden = 1;
      if (await this.checkPermission()) {
        BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
        if (result.hasContent) {
          BarcodeScanner.hideBackground();
          if (this.orders.some(x => x.numberOfOrders == result.content)) {
            this.checkOrder = true
            var OrderElement = this.orders.findIndex(x => x.numberOfOrders == result.content)
            this.verifiedElement(OrderElement)

          } else {
            this.aproveOrden = 3;
            Vibration.vibrate(1000);
            setTimeout(() => {
                this.aproveOrden = 1
                this.scanOrder()
            }, 1000)
          }
        } else {
          this.aproveOrden = 1;
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
      this.orders[val].completed = true
      this.$store.commit("scanOrder", this.orders);
      setTimeout(() => {
        this.checkOrder = false
        if (this.orders.every(x => x.completed == true)){
        this.aproveOrden = 2
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

}
.box-orden li{
  margin: 0px 5px;
  width: 10%;
}
.stiky {
  color: #000 !important;
  top: 0px;
  z-index: 2;
  padding: 5px 10px !important;
  background-color: rgb(248 248 248);
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
  background: fff;
}
</style>
