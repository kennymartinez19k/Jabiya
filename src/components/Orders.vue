<template>
  <div class="uk-flex uk-flex-column uk-flex-between cnt">
    <div class="stiky">
      <h5
        class="uk-text-center uk-margin-remove"
        style="margin-bottom: 5px !important"
      >
        <strong>ILS 11/23/2021 1:30PM Gate 01</strong>
      </h5>
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
            <strong>Shipper:</strong><span>&nbsp; {{ load?.client }}</span>
          </p>
          <p class="uk-width-1-1 uk-flex">
            <strong>Zona de Destino:</strong
            ><span>&nbsp; {{ load?.zone }}</span>
          </p>
        </div>
        <div class="info-header">
          <span class="status">Carga {{ load?.status }}</span>
          <img
            v-if="load?.status == 'Asignada'"
            src="../assets/truckGreen.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="load?.status == 'Entregada'"
            src="../assets/truckDefault.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="load?.status == 'En Ruta'"
            src="../assets/truckBlue.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="load?.status == 'Despacho Aprobado'"
            src="../assets/truckOrange.png"
            class="icon-load"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="uk-card uk-card-default uk-width-1-2@m uk-margin-medium-bottom">
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
                style="font-size: 13px !important; font-weight: 700"
                class="uk-width-1-1"
              >
                <span>{{ order.client }}</span>
              </p>
            </div>
          </div>
          <p class="uk-width-1-2">
            <strong>Orden: </strong><span>{{ order.numberOfOrders }}</span>
          </p>
          <p class="uk-width-1-2">
            <strong>Cajas: </strong>{{ order.numberOfBox }}<span></span>
          </p>
          <p class="uk-width-1-1">
            <font-awesome-icon icon="map-marker-alt" />&nbsp;<span>{{
              order.address
            }}</span>
          </p>
        </div>
        <div
          class="uk-flex uk-flex-column"
          style="min-width: 90px; margin-left: 7px; align-items: flex-end"
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
        class="slide"
        text="Escaneo Corrido"
        success-text="success"
        @completed="complete(orders)"
        textSize="10px"
      />
    </div>
  </div>
</template>

<script>
import {} from "../assets/img/truk1.png";
import SlideUnlock from "vue-slide-unlock";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      status: null,
      result: null,
      load: null,
      completed: "background-color: #2a307c !important",
      orders: [
        {
          numberOfOrders: 1234,
          numberOfBox: 2,
          client: "Juan Martinez Soto",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
        },
        {
          numberOfOrders: 1223,
          numberOfBox: 2,
          client: "Maria Lisbeth Alcantara Rodriguez",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
        },
        {
          numberOfOrders: 3321,
          numberOfBox: 2,
          client: "Albert Perez",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
        },
        {
          numberOfOrders: 4324,
          numberOfBox: 2,
          client: "Jose Abreu Pichardo",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
        },
        {
          numberOfOrders: 7532,
          numberOfBox: 2,
          client: "Juan Jose Garcia",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
        },
        {
          numberOfOrders: 1243,
          numberOfBox: 2,
          client: "Juan Martinez Soto",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
        },
        {
          numberOfOrders: 5214,
          numberOfBox: 2,
          client: "Maria Lisbeth Alcantara Rodriguez",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
        },
        {
          numberOfOrders: 3753,
          numberOfBox: 2,
          client: "Albert Perez",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
        },
        {
          numberOfOrders: 1027,
          numberOfBox: 2,
          client: "Jose Abreu Pichardo",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
        },
        {
          numberOfOrders: 9120,
          numberOfBox: 2,
          client: "Juan Jose Garcia",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
        },
      ],
    };
  },
  components: {
    SlideUnlock,
  },
  computed: {
    ...mapGetters(["loadStore", "orderScan"]),
  },
  mounted() {
    this.$store.commit("setCurrent", {
      menuName: "Cargar Vehiculo",
      componentName: "orders",
    });
    this.load = this.loadStore;

    if (this.orderScan) {
      this.completedOrden();
    }
    this.orderObj();
  },
  methods: {
    complete(val) {
      this.scan(val);
    },
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
      this.$store.commit("scanOrder", val);
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
}
.status {
  color: green;
  font-weight: 500;
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
  transform: scaleX(-1);
  width: 70px;
  display: flex;
}
.stiky {
  color: #000 !important;
  top: 0px;
  z-index: 2;
  padding: 5px 10px !important;
  background-color: rgb(248 248 248);
  box-shadow: 1px 0px 5px #898989;
}

.img-scan {
  width: 39px;
}
.icon-load {
  width: 35%;
  margin-right: 20px;
  transform: scaleX(-1);
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
</style>
