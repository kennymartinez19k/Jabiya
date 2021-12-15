<template>
  <div class="uk-flex uk-flex-column cnt">
    <div class="stiky">
      <span
        style="margin-bottom: 5px !important; font-weight: 500"
      >
        {{load?.loadNumber}}
      </span>
      <div
        class="
          uk-flex
          uk-flex
          uk-flex-between
          uk-flex-left
          uk-margin-remove
          uk-padding-remove
        "
        style="align-items: center;"
      >
        <div style=" width: 100%" class="uk-flex uk-flex-wrap">
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
    <div class="uk-padding-small uk-width-1-2@m uk-margin-medium-bottom">
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
            <span class="font-weight-medium">Cajas: </span>{{ order.numberOfBox }}<span></span>
          </p>
          <p class="uk-width-1-1">
            <font-awesome-icon icon="map-marker-alt" />&nbsp;<span>{{
              order.zone.name
            }}</span>
          </p>
        </div>
        <div
          class="uk-flex uk-flex-column"
          style="min-width: 83px; margin-left: 7px; align-items: flex-end"
        >
          <div
            class="uk-flex uk-flex-column"
            @click="scan(order)"
            style="align-items: center"
          >
            <img src="../assets/parcel.png" class="img-scan" alt="" />
            <span v-if="order.completed">Descargar Orden</span>
            <span v-else>Escanear Orden</span>
          </div>
        </div>
      </div>
    </div>
    <div></div>
    <div class="slide-div">
      <slide-unlock
        ref="vueslideunlock"
        :auto-width="true"
        :circle="true"
        :disabled="false"
        :noanimate="false"
        :width="400"
        :height="40"
        :completedBg="completed"
        class="slide box-slide"
        text="Escaneo Corrido"
        success-text="success"
        @completed="scan(orders)"
      />
    </div>
  </div>
</template>

<script>
import SlideUnlock from "vue-slide-unlock";
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
      orders: null
    };
  },
  components: {
    SlideUnlock,
  },
  computed: {
    ...mapGetters(["loadStore", "orderScan", 'loads']),
  },
  mounted() {
    this.load = this.loadStore;
    this.orders = this.loadStore.orders
    console.log(this.loadStore)
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
    scan(val) {
      let orderScan = []
      if (val.length) {
        orderScan = val
      } else {
        orderScan.push(val)
      }
      this.$store.commit("scanOrder", orderScan);
      this.$emit("deliveryActions", `Orden No: ${this.orderScan[0]?.order_num}`);
      this.$router.push({ name: "scan-order" }).catch(() => {});
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
.slide-div {
  background: #ffffff !important;
  height: 70px;
  width: 100%;
  position: absolute;
  bottom: 0px;
}
.cnt {
  height: 100%;
  overflow: scroll;
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
  border-top: 1px solid #b8b8b8;
  font-size: 12px !important;
  padding: 5px 10px 2px !important;
 background: #2a307c;
 font-weight: 300 !important;
 text-align: start;
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
  background-image: url('../assets/parcel.png');
    background-size: 25px 25px;
    background-repeat: no-repeat;
    background-position: 80%
}
</style>
