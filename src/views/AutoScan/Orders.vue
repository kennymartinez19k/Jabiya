<template>
  <div class="uk-flex uk-flex-column cnt">
    <div class="stiky">
      <p
        style=" font-size: 13px; !important; font-weight: 500"
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
            <span style="font-weight: 500">Destino:</span><span>&nbsp; {{ load?.shipperZone }}</span>
          </p>
          
          
        </div>
        
      </div>
    </div>
    <div class="uk-padding-small uk-width-1-2@m" style="margin-bottom: 50px!important;">
      <div
        v-for="order in orders"
        :key="order"
        class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        :class="{ ordenCompleted: order.completed }"
      >
        <div class="uk-text-left info-user uk-flex uk-flex-wrap">
          <div class="btn uk-flex">
            <div class="uk-flex uk-flex-column uk-text-left">
              <span
                v-if="order.completed"
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
                style="!important; font-weight: 500"
                class="uk-width-1-1"
              >
                <span>{{ order.client_name }}</span>
              </p>
            </div>
          </div>
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Orden: </span><span>{{ order.order_num }}</span>
          </p>
          <p class="">
            <span class="font-weight-medium">Cajas: </span>0 <span></span>
          </p>
          <p class="uk-width-1-1">
            <font-awesome-icon icon="map-marker-alt" />&nbsp;<span>{{
              order.zone.name
            }}</span>
          </p>
        </div>
        <div
          class="uk-flex uk-flex-column"
          style="min-width: 70px; margin-left: 7px; align-items: flex-end"
        >
          <div
            v-if="!order.completed"
            class="uk-flex uk-flex-column"
            @click="autoScan(order)"
            style="align-items: center"
          >
            <img src="../../assets/road.png" class="img-scan" alt="" />
            <span>Iniciar Ruta</span>
          </div>
          <div
            v-if="order.completed"
            class="uk-flex uk-flex-column"
            @click="downloadOrders(order)"
            style="align-items: center"
          >
            <img src="../../assets/road.png" class="img-scan" alt="" />
            <span>Descargar Orden</span>
          </div>
        </div>
      </div>
    </div>
    <div></div>
    <div class="button-opt">
      <button @click="uploadTruck()" class="uk-button uk-button-transparent">Cargar Vehiculo 
          <img src="../../assets/load-truck.png" style="width: 25px; margin-left: 5px ">
      </button>
      <button @click="autoScan(orders)" class="uk-button uk-button-transparent">Iniciar Ruta
          <img src="../../assets/road.png" style="width: 25px; margin-left: 5px ">
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  alias: `Cargar Vehiculo`,
  name: `cargarrr`,
  data() {
    return {
      status: null,
      result: null,
      load: null,
      completed: "background-color: #2a307c !important",
      orders: null,
      ordersProof: [
        {
          numberOfOrders: 1234,
          order_num: 2,
          client_name: "Juan Martinez Soto",
          zone_name: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 08:00')
        },
        {
          numberOfOrders: 1223,
          order_num: 2,
          client_name: "Maria Lisbeth Alcantara Rodriguez",
          zone_name: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 10:00')
        },
        {
          numberOfOrders: 3321,
          order_num: 2,
          client_name: "Albert Perez",
          zone_name: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 12:00')
        },
        {
          numberOfOrders: 4324,
          order_num: 2,
          client_name: "Jose Abreu Pichardo",
          zone_name: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 14:00')
        },
        {
          numberOfOrders: 3753,
          order_num: 2,
          client_name: "Albert Perez",
          zone_name: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 16:22')
        },
        {
          numberOfOrders: 1027,
          order_num: 2,
          client_name: "Jose Abreu Pichardo",
          zone_name: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 18:22')
        },
        {
          numberOfOrders: 9120,
          order_num: 2,
          client_name: "Juan Jose Garcia",
          zone_name: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 20:22')
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["loadStore", "orderScan", "loads", "allLoads"]),
  },
  mounted() {
    if(this.loadStore){
      this.load = this.loadStore;
    }else{
      this.load = this.allLoads.find(x => x.status == "Driver Arrival" || x.status == "Driver Assigned" )
    }
    this.orders = this.load.orders
    console.log(this.orders)
    if (this.orderScan) {
      this.completedOrden();
    }
    this.orderObj();
  },
  methods: {
    orderObj() {
      this.orders.sort((a) => {
        if (a.completed == true) {
          return 1;
        } else {
          return -1;
        }
      });
    },
    downloadOrders(val){
      if(val.completed){
        val.completed = false
      }
    },
    uploadTruck(){
        this.orders.map(x => x.completed = true)
    },
    autoScan(val) {
      let orderScan = []
      if (val.length) {
        orderScan = val
        this.$emit("deliveryActions", 'Ordenes en Ruta');
      } else {
        this.$emit("deliveryActions", `Orden No: ${val?.order_num}`);
        orderScan.push(val)
      }
      
      this.orders.map(x => x.completed = true)
      console.log(this.orders) 
      this.$store.commit("scanOrder", orderScan);
      this.$router.push({ name: "maps" }).catch(() => {});
    },
    completedOrden() {
      this.orders.forEach((x) => {
        if (x.numberOfOrders == this.orderScan.numberOfOrders) {
          x.completed = this.orderScan.completed;
        } else x.completed = false;
      });
    },
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
  height: 60px;
  border-top: 1px solid #b1b1b1;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  padding: 10px;
  position: absolute;
  bottom: 0px;
}
.button-opt button{
    padding: 0px 15px !important;
    align-items: center;
    display: flex;
    font-size: 12px;
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
.info-user {
  border-right: 1px solid #ccc;
  padding-right: 5px;
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
</style>
