<template>
  <div class="uk-flex uk-flex-column cnt">
      <Loading
  class="loading-position"
    :active="loaded"
    color="rgb(86, 76, 175)"
    loader="spinner"
    :width="100"
    background-color="rgba(252, 252, 252, 0.7)"
  ></Loading>
    <div class="stiky">
      <p
        style=" font-size: 13px !important; font-weight: 500"
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
            <span class="font-weight-medium">Shipper: </span><span>&nbsp; {{ shipperName(load) }}</span>      
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span><span>&nbsp; {{ load?.firstOrdenInfo.sector }}</span>
          </p>
        </div>
      </div>
    </div>
    
    <div class="uk-padding-small uk-width-1-2@m" style="margin-bottom: 50px!important;">
      <div
        v-for="order in orders"
        :key="order"
        class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        :class="{ ordenCompleted: order?.completed }"
      >
        <div class="uk-text-left info-user uk-flex uk-flex-wrap">
          <div class="btn uk-flex">
            <div class="uk-flex uk-flex-column uk-text-left">
              <span
                v-if="order?.completed"
                style="
                  display: flex;
                  position: relative;
                  top: -4px;
                  color: green;
                "
              >
                <strong>Completado </strong>
                <font-awesome-icon
                  icon="check"
                  style="font-size: 14px; margin: 3px"
                />
              </span>
              <p
                class="uk-width-1-1"
              >
                <span class="font-weight-medium">Cliente: </span>
                <span>{{ order.client_name }}</span>
              </p>
            </div>
          </div>
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Orden: </span><span>{{ order.order_num }}</span>
          </p>
          <p class="">
            <span class="font-weight-medium">Cajas / Pallets: </span>{{order.products?.length}}<span></span>
          </p>
          <p class="uk-width-1-1">
            <span class="font-weight-medium">Destino: </span>
            <font-awesome-icon icon="map-marker-alt" />&nbsp;<span>{{
              order.sector
            }}</span>
          </p>
        </div>
        
      </div>
    </div>
    <div></div>
    <div class="button-opt ">
      <button @click="uploadOrDownload(load)" class="uk-button uk-width-1-1 uk-button-blue">{{messageStatusLoad}}
      </button>
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Loading from "vue-loading-overlay";
import { Storage} from '@ionic/storage'


export default {
  alias: `Montar Viaje`,
  components:{
    Loading
  },
  data() {
    return {
      status: null,
      result: null,
      load: null,
      completed: "background-color: #2a307c !important",
      orders: null,
      loaded: false,
      localStorageGps: new Storage(),

    };
  },
  computed: {
    ...mapGetters(["loadStore", "orderScan", "loads", "allLoadsStore", "products"]),

     productsBox: function () {
      if (this.products?.length !== 0) {
        return  this.products[0]?.quantity
      }
      return null
    },
    messageStatusLoad : function () {
      var status = this.orders?.some(x => x.completed)
      if (status) return 'Desmontar Viaje'
      return 'Montar Viaje'
      }
  },
  mounted() {
    this.localStorageGps.create();

    if(this.loadStore){
      this.load = this.loadStore;
      this.orders = this.load.Orders.filter(x => !x.isReturn)
      if(this.orders.length == 0){
         this.orders = this.load.Orders.filter(x => x.isReturn)
      }
    }
    if (this.orderScan) {
      this.completedOrden();
    }
    this.orderObj();
  },
  methods: {
    orderObj() {
      this.orders?.sort((a) => {
        if (a?.completed == true) {
          return 1;
        } else {
          return -1;
        }
      });
    },
    completedOrden() {
      this.orders.forEach((x) => {
        if (x.numberOfOrders == this.orderScan.numberOfOrders) {
          x.completed = this.orderScan?.completed;
        } else x.completed = false;
      });
    },
    shipperName(val){
      var shipper = val?.shipper?.find(x => x)
      return shipper?.name
    },
    firstOrderSector(val){
      var shipper = val?.shipper?.find(x => x)
      return shipper?.name
    },
    async uploadOrDownload(val){
      this.loaded = true
      this.localStorageGps.remove(`gps ${val.loadMapId}`)
      let totalOfBoxes = await this.setLoadTruck(val)
      await this.$services.loadsScanServices.completeLoad(this.load.loadMapId, totalOfBoxes ) 
      this.$router.push({name: 'load-status'})

    },
    async setLoadTruck(val){
      let totalOfBoxes = 0
      for(let cont = 0; cont < val.Orders.length; cont++){
        let order = val.Orders[cont]
        this.$store.commit("setloadStore", val)
        totalOfBoxes += order.no_of_boxes
        for(var i = 0; i < order.products.length; i++){
          let prod = order.products[i]
          if(prod.scanOneByOne === "no") {
            await this.$services.loadsScanServices.scanProduct(order._id, prod._id, prod.loadScanningCounter, prod.product._id, prod.qrCode  );
          }
          else {
            for(let i = 0; i <= prod.quantity; i++){
              await this.$services.loadsScanServices.scanProduct(order._id, prod._id, prod.loadScanningCounter, prod.product._id, prod.qrCode  );
            }
          }
        }
      }
      return totalOfBoxes
    },
    setMap(){
      window.open("https://www.google.com/maps/dir/'18.475615,-69.957918'/'18.478645,-69.966486'")
    }
  },
};
</script>

<style scoped>
:root {
  --su-size-text: 12px;
}
.slideunlock .slideunlock-text{
  font-size: var(--su-size-text);
}
p {
  margin: 2px 0px !important;
}
.slide .slideunlock.is-complete .slideunlock-progressbar {
  background-color: #2a307c;
}
.button-opt {
  background: #ffffff !important;
  border-top: 1px solid #b1b1b1;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  padding: 10px;
  position: absolute;
  bottom: 0px;
}

.uk-card {
  padding: 20px 10px;
}
.uk-card-body {
  margin-bottom: 10px;
  align-items: center;
  padding: 10px 11px;
  border: 0.1px solid #e5e5e5;
}
.slide {
  position: fixed;
  width: 97% !important;
  bottom: 5px;
  height: 40px;
  --su-size-text: 18px;
}
.status {
  font-size: 12px;
}
.btn {
  display: flex;
  align-items: baseline;
  width: 100%;
  justify-content: flex-start;
}
.btn img {
  width: 30px;
  position: relative;
  top: -2px;
  margin-left: 5px;
}

.scan-code img {
  width: 28px;
  position: relative;
  top: -2px;
  left: 4px;
}

.truckSpan {
  max-width: 100%;
}
.truck {
  max-width: 100%;
  width: 70px;
  display: flex;
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
.img-scan {
  width: 39px;
}
.icon-load {
  width: 35%;
  margin-right: 20px;
}
.btn-scan {
  margin-top: 12px;
  box-shadow: 0px -0.5px 3px #000;
  border: 0px;
  color: #fff;
  padding: 3px;
  background: #2a307c;
}

.info-header {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.ordenCompleted {
  background: rgba(233, 255, 233, 0.6);
}
.box-slide {
  background-image: url('../../assets/parcel.png');
    background-size: 25px 25px;
    background-repeat: no-repeat;
    background-position: 80%
}
.loading-position{
  position: absolute;
  z-index: 1;
  top: 278px;
  right: 11px;
  height: 100%;
  width: 92%;
}
</style>
